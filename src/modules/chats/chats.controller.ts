import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserPipe } from '../users/pipes/user.pipe';
import { User } from '../users/entities/user.entity';
import { ChatsService } from './chats.service';
import { CustomRequest } from '../../shared/decorators/custom-request.decorator';
import { mapChatToEntity as mapChatToEntity } from './mappers/mapChatToEntity';
import { ChatEntity, ChatEntityWithThreads } from './types/entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { OpenaiService } from '../ai/services/openai.service';
import { ThreadsService } from '../threads/threads.service';
import { TokensService } from '../ai/services/tokens.service';
import { CreateChatRequestDto, CreateChatResponseDto } from './types/dto';
import { MessagesService } from '../messages/messages.service';
import { ThreadCreateData } from '../threads/types/data';
import { MessageCreateData } from '../messages/types/data';
import { mapToChatEntityWithThreads } from './mappers/mapToChatEntityWithThreads';

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

  @Get(':id')
  async getChat(
    @CustomRequest(UserPipe)
    user: User,
    @Param('id') id: string,
  ): Promise<ChatEntityWithThreads> {
    const chat = await this.chatsService.getById(id);
    const threads = await this.threadsService.getByChatId(chat.id);
    const messages = await this.messagesService.getByChatId(chat.id);

    return mapToChatEntityWithThreads(chat, threads, messages);
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

    return mapToChatEntityWithThreads(chat, threads, messages);

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
