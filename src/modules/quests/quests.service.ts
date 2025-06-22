import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quest } from './entities/quest.entity';
import { QuestStatus } from './types/entity';
import { FIRST_QUEST_DATA } from './data/first-quest-data';
import * as dayjs from 'dayjs';

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quest)
    private readonly repository: Repository<Quest>,
  ) {}

  async save(goal: Quest): Promise<Quest> {
    return this.repository.save(goal);
  }

  getByHeroId(heroId: string, status?: QuestStatus) {
    return this.repository.find({
      where: { heroId, status },
    });
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  delete(id: string) {
    return this.repository.delete({ id });
  }

  createHeroQuest(
    data: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Quest> {
    return this.repository.save(data);
  }

  createInitialQuest(data: { heroId: string; userId: string }) {
    return this.createHeroQuest({
      ...data,
      ...FIRST_QUEST_DATA,
      isInitial: true,
      deadline: dayjs().add(3, 'day').toDate(),
    });
  }

  async accomplishInitialQuest(heroId: string) {
    const initialQuest = await this.repository.findOne({
      where: { heroId, isInitial: true, status: 'active' },
    });

    if (initialQuest) {
      return this.repository.update(
        { heroId, isInitial: true },
        { status: 'achieved' },
      );
    }
  }
}
