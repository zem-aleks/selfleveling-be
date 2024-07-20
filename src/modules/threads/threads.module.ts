import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './entities/thread.entity';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';
import { MessagesModule } from '../messages/messages.module';
import { AiModule } from '../ai/ai.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Thread]),
    MessagesModule,
    AiModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [ThreadsController],
  providers: [ThreadsService],
  exports: [ThreadsService],
})
export class ThreadsModule {}
