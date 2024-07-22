import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { Chat } from './entities/chat.entity';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { noOperation } from '../../shared/utils/notReachable';

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
    if (chat.userId !== user.id) {
      throw new NotFoundException(`Chat  not found`);
    }

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

    // non-blocking generation
    this.generateChatTitle({
      chat,
      userMessage: message,
    }).then(noOperation);

    return mapToChatEntityWithThreads(chat, threads, messages);
  }

  async generateChatTitle({
    chat,
    userMessage,
  }: {
    chat: Chat;
    userMessage: string;
  }) {
    const title = await this.openaiService.completeChat({
      modelType: 'gpt-4o',
      messages: [
        new SystemMessage({
          content: `Your goal is to generate a short title of chat based on user's message. Don't add any comments. Output must contain only title. Preferable not more than 5 words.`,
        }),
        new HumanMessage({
          content: userMessage,
        }),
      ],
      temperature: 0.5,
    });

    return this.chatsService.save({
      ...chat,
      title,
    });
  }
}
