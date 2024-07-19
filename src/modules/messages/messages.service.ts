import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { MessageCreateData } from './types/data';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
  ) {}

  async create(data: MessageCreateData): Promise<Message> {
    return this.repository.save(data);
  }

  async createMany(data: MessageCreateData[]): Promise<Message[]> {
    return this.repository.save(data);
  }

  getById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  getByChatId(chatId: string) {
    return this.repository.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
    });
  }

  getChatsByUserId(userId: string, skip?: number, take?: number) {
    return this.repository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    });
  }

  delete(id: number) {
    return this.repository.delete({
      id,
    });
  }
}
