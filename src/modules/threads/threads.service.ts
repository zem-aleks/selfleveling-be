import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Thread } from './entities/thread.entity';
import { ThreadCreateData } from './types/data';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private readonly repository: Repository<Thread>,
  ) {}

  async create(data: ThreadCreateData): Promise<Thread> {
    return this.repository.save(data);
  }

  async createMany(data: Array<ThreadCreateData>): Promise<Thread[]> {
    return this.repository.save(data);
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  getByIds(ids: string[]) {
    return this.repository.find({ where: { id: In(ids) } });
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

  delete(id: string) {
    return this.repository.delete({
      id,
    });
  }
}
