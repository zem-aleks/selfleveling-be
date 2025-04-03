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

  async save(kpi: Kpi): Promise<Kpi> {
    return this.repository.save(kpi);
  }

  async saveDrafts(
    drafts: Array<Omit<Kpi, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Kpi[]> {
    return this.repository.save(drafts);
  }

  getKpisByGoalId(goalId: string) {
    return this.repository.find({
      where: { goalId },
      order: { status: 'ASC', createdAt: 'ASC' },
    });
  }

  getActiveKpisByGoalId(goalId: string) {
    return this.repository.find({
      where: { goalId, status: 'active' },
      order: { status: 'ASC', createdAt: 'ASC' },
    });
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }
}
