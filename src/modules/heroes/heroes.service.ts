import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from './entities/hero.entity';
import { HeroEntity } from './types/entity';
import { DEFAULT_HERO_ATTRIBUTES } from './constant/defaultHeroAttributes';

@Injectable()
export class HeroesService {
  constructor(
    @InjectRepository(Hero)
    private readonly repository: Repository<Hero>,
  ) {}

  async create(
    data: Omit<HeroEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<HeroEntity> {
    return this.repository.save({
      ...data,
      attributes: DEFAULT_HERO_ATTRIBUTES,
    });
  }

  async save(hero: Hero): Promise<Hero> {
    return this.repository.save(hero);
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

  softDelete(id: string) {
    return this.repository.softDelete({ id });
  }

  delete(id: string) {
    return this.repository.delete({
      id,
    });
  }
}
