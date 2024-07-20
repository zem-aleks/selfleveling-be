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

  async update(message: Message): Promise<Message> {
    return this.repository.save(message);
  }

  getById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getByChatId(chatId: string) {
    const messages = await this.repository.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
    });
    return messages.sort((a, b) => {
      if (a.role === 'system' && b.role !== 'system') {
        return -1;
      }
      return 1;
    });
  }

  getByThreadId(threadId: string) {
    return this.repository.find({
      where: { threadId },
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
