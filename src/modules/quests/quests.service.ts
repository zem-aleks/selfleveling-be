import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quest } from './entities/quest.entity';

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quest)
    private readonly repository: Repository<Quest>,
  ) {}

  async save(goal: Quest): Promise<Quest> {
    return this.repository.save(goal);
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  delete(id: string) {
    return this.repository.delete({ id });
  }
}
