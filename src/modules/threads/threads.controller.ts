import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { UserPipe } from '../users/pipes/user.pipe';
import { User } from '../users/entities/user.entity';
import { CustomRequest } from '../../shared/decorators/custom-request.decorator';
import { ModelType, OpenaiService } from '../ai/services/openai.service';
import { ThreadsService } from './threads.service';
import { TokensService } from '../ai/services/tokens.service';
import { MessagesService } from '../messages/messages.service';
import { mapDbMessageIntoAi } from '../ai/mappers/mapDbMessageIntoAi';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { catchError, concat, finalize, map, of, throwError } from 'rxjs';
import { notReachable } from '../../shared/utils/notReachable';
import { mapMessageToEntity } from '../messages/mappers/mapMessageToEntity';

@Controller('threads')
@UseGuards(JwtAuthGuard)
export class ThreadsController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly tokensService: TokensService,
    private readonly threadsService: ThreadsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Patch()
  async addMessageToThreads(
    @CustomRequest(UserPipe) user: User,
    @Body() { message, threadIds }: { message: string; threadIds: string[] },
  ) {
    const threads = await this.threadsService.getByIds(threadIds);
    if (threads.some((thread) => thread.userId !== user.id)) {
      throw new NotFoundException(`Thread not found`);
    }

    const tokens = this.tokensService.getTokensCount(message);
    const messages = await this.messagesService.createMany(
      threads.map((thread) => ({
        userId: user.id,
        threadId: thread.id,
        chatId: thread.chatId,
        role: 'user',
        tokens,
        content: message,
      })),
    );

    return messages.map(mapMessageToEntity);
  }

  @Sse(':threadId')
  async processThreadMessage(
    @CustomRequest(UserPipe) user: User,
    @Param('threadId') threadId: string,
  ) {
    const thread = await this.threadsService.getById(threadId);
    if (thread.userId !== user.id) {
      throw new NotFoundException(`Thread not found`);
    }

    const messages = await this.messagesService.getByThreadId(thread.id);
    const topMessage = messages[messages.length - 1];
    const aiChatMessages = messages.map(mapDbMessageIntoAi);

    if (topMessage.role !== 'user') {
      throw new BadRequestException(
        'Last message in thread must be user message',
      );
    }

    const newMessage = await this.messagesService.create({
      userId: user.id,
      threadId: thread.id,
      chatId: thread.chatId,
      role: 'assistant',
      tokens: 0,
      content: '',
    });

    // TODO: check if model type is valid and supported!
    const observable = await this.openaiService.completeChatStream({
      modelType: thread.modelType as ModelType,
      temperature: thread.temperature,
      messages: aiChatMessages,
    });

    let aggregatedMessage = '';

    const streamObservable = observable.pipe(
      map((streamResponse) => {
        switch (streamResponse.type) {
          case 'chunk':
            aggregatedMessage += streamResponse.content;
            return { data: streamResponse };

          default:
            return notReachable(streamResponse.type);
        }
      }),
      catchError(async (error) => {
        console.log('Error in stream', error);
        return throwError(error);
      }),
      finalize(async () => {
        console.log('finalized');
        const tokens = this.tokensService.getTokensCount(aggregatedMessage);
        await this.messagesService.update({
          ...newMessage,
          content: aggregatedMessage,
          tokens,
        });
      }),
    );

    const finalEventObservable = of({
      data: 'final',
    }).pipe(
      map(() => {
        const tokens = this.tokensService.getTokensCount(aggregatedMessage);
        return {
          data: {
            type: 'final',
            message: mapMessageToEntity({
              ...newMessage,
              content: aggregatedMessage,
              tokens,
            }),
          },
        };
      }),
    );

    return concat(streamObservable, finalEventObservable);
  }
}
