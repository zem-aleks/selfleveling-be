import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserPipe } from '../users/pipes/user.pipe';
import { User } from '../users/entities/user.entity';
import { ChatsService } from './chats.service';
import { CustomRequest } from '../../shared/decorators/custom-request.decorator';
import { mapToEntity } from './mappers/mapToEntity';
import { ChatEntity } from './types/entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async get(
    @CustomRequest(UserPipe)
    user: User,
  ): Promise<ChatEntity[]> {
    const chats = await this.chatsService.getChatsByUserId(user.id);
    return chats.map(mapToEntity);
  }

  @Post()
  async create(
    @CustomRequest(UserPipe)
    user: User,
    @Body() { title }: { title: string },
  ): Promise<ChatEntity> {
    const chat = await this.chatsService.create({
      userId: user.id,
      title,
      logo: null,
      subtitle: null,
    });

    return mapToEntity(chat);
  }
}
