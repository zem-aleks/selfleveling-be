import { forwardRef, Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { AiModule } from '../ai/ai.module';
import { ThreadsModule } from '../threads/threads.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    forwardRef(() => UsersModule),
    AiModule,
    ThreadsModule,
    MessagesModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [],
})
export class ChatsModule {}
