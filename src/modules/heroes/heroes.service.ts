import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from './entities/hero.entity';
import { HeroEntity } from './types/entity';

@Injectable()
export class HeroesService {
  constructor(
    @InjectRepository(Hero)
    private readonly repository: Repository<Hero>,
  ) {}

  async create(
    data: Omit<HeroEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<HeroEntity> {
    return this.repository.save(data);
  }

  async save(chat: Hero): Promise<Hero> {
    return this.repository.save(chat);
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  getHeroesByUserId(userId: string, skip?: number, take?: number) {
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
