import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { GoalDraft } from './types/entity';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly repository: Repository<Goal>,
  ) {}

  async createDraft(
    data: Omit<
      GoalDraft,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'threadId'
      | 'score'
      | 'followUpQuestion'
    >,
  ): Promise<Goal> {
    return this.repository.save(data);
  }

  async save(goal: Goal): Promise<Goal> {
    return this.repository.save(goal);
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  getActiveByHeroId(heroId: string) {
    return this.repository.find({
      where: { heroId, status: 'active' },
    });
  }

  getDraftsByHero(heroId: string) {
    return this.repository.find({
      where: { heroId, status: Not('active') },
    });
  }

  delete(id: string) {
    return this.repository.delete({ id });
  }
}
