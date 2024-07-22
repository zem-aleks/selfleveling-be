import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatEntity } from './types/entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatsRepository: Repository<Chat>,
  ) {}

  async create(
    data: Omit<ChatEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ChatEntity> {
    return this.chatsRepository.save(data);
  }

  async save(chat: Chat): Promise<Chat> {
    return this.chatsRepository.save(chat);
  }

  getById(id: string) {
    return this.chatsRepository.findOne({ where: { id } });
  }

  getChatsByUserId(userId: string, skip?: number, take?: number) {
    return this.chatsRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    });
  }

  delete(id: string) {
    return this.chatsRepository.delete({
      id,
    });
  }
}
