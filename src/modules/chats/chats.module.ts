import { forwardRef, Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), forwardRef(() => UsersModule)],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [],
})
export class ChatsModule {}
