import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kpi } from './entities/kpi.entity';

@Injectable()
export class KpisService {
  constructor(
    @InjectRepository(Kpi)
    private readonly repository: Repository<Kpi>,
  ) {}

  async save(goal: Kpi): Promise<Kpi> {
    return this.repository.save(goal);
  }

  async saveDrafts(
    drafts: Array<Omit<Kpi, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Kpi[]> {
    return this.repository.save(drafts);
  }

  getDraftsByGoalId(goalId: string) {
    return this.repository.find({
      where: { status: 'draft', goalId },
      order: { createdAt: 'ASC' },
    });
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }
}
