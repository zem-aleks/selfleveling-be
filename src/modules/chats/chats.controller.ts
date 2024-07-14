import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserPipe } from '../users/pipes/user.pipe';
import { User } from '../users/entities/user.entity';
import { ChatsService } from './chats.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CustomRequest } from '../../shared/decorators/custom-request.decorator';
import { mapToEntity } from './mappers/mapToEntity';
import { ChatEntity } from './types/entity';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
