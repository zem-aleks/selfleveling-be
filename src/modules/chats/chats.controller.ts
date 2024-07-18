import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserPipe } from '../users/pipes/user.pipe';
import { User } from '../users/entities/user.entity';
import { ChatsService } from './chats.service';
import { CustomRequest } from '../../shared/decorators/custom-request.decorator';
import { mapChatToEntity as mapChatToEntity } from './mappers/mapChatToEntity';
import { ChatEntity } from './types/entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { OpenaiService } from '../ai/services/openai.service';
import { ThreadsService } from '../threads/threads.service';
import { TokensService } from '../ai/services/tokens.service';
import { mapToThreadWithMessages } from '../threads/mappers/mapToEntity';
import { CreateChatRequestDto, CreateChatResponseDto } from './types/dto';
import { MessagesService } from '../messages/messages.service';
import { ThreadCreateData } from '../threads/types/data';
import { MessageCreateData } from '../messages/types/data';
import { ThreadEntityWithMessages } from '../threads/types/entity';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly openaiService: OpenaiService,
    private readonly tokensService: TokensService,
    private readonly threadsService: ThreadsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Get()
  async get(
    @CustomRequest(UserPipe)
    user: User,
  ): Promise<ChatEntity[]> {
    const chats = await this.chatsService.getChatsByUserId(user.id);
    return chats.map(mapChatToEntity);
  }

  @Post()
  async create(
    // @Res() res: Response,
    @CustomRequest(UserPipe) user: User,
    @Body() { threadConfigs, message }: CreateChatRequestDto,
  ): Promise<CreateChatResponseDto> {
    const messageTokens = this.tokensService.getTokensCount(message);
    const subtitle =
      threadConfigs.length === 1
        ? threadConfigs[0].modelType
        : `${threadConfigs.length} models`;

    const chat = await this.chatsService.create({
      userId: user.id,
      title: 'New chat',
      logo: null,
      subtitle,
    });

    const threadCreateData: ThreadCreateData[] = threadConfigs.map(
      (threadConfig) => {
        return {
          userId: user.id,
          chatId: chat.id,
          modelType: threadConfig.modelType,
          temperature: threadConfig.temperature,
          systemPrompt: threadConfig.systemPrompt,
          systemPromptTokens: this.tokensService.getTokensCount(
            threadConfig.systemPrompt,
          ),
          tokensUsed: 0,
        };
      },
    );

    const threads = await this.threadsService.createMany(threadCreateData);

    const data = threads.map((thread) => {
      const systemMessage: MessageCreateData = {
        content: thread.systemPrompt,
        tokens: thread.systemPromptTokens,
        role: 'system',
        chatId: chat.id,
        userId: user.id,
        threadId: thread.id,
      };

      const userMessage: MessageCreateData = {
        content: message,
        tokens: messageTokens,
        role: 'user',
        chatId: chat.id,
        userId: user.id,
        threadId: thread.id,
      };

      return [systemMessage, userMessage];
    });

    const messagesCreateData: MessageCreateData[] = data.flat();
    const messages = await this.messagesService.createMany(messagesCreateData);
    const threadsWithMessages: ThreadEntityWithMessages[] = threads.map(
      (thread) => {
        const threadMessages = messages.filter(
          (message) => message.threadId === thread.id,
        );
        return mapToThreadWithMessages(thread, threadMessages);
      },
    );

    return {
      ...mapChatToEntity(chat),
      threads: threadsWithMessages,
    };

    // const data = await this.openaiService.completeChatStream({
    //   modelType: modelType,
    //   temperature: temperature,
    //   messages: [
    //     new SystemMessage({ content: systemPrompt }),
    //     new HumanMessage({ content: message }),
    //   ],
    // });
    //
    // return observableToStream(data);
  }
}
