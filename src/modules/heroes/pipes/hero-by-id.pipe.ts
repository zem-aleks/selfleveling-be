import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { HeroesService } from '../heroes.service';
import { Hero } from '../entities/hero.entity';

@Injectable()
export class HeroByIdPipe implements PipeTransform<string, Promise<Hero>> {
  constructor(private readonly heroesService: HeroesService) {}

  async transform(heroId: string): Promise<Hero> {
    const hero = await this.heroesService.getById(heroId);
    if (!hero) {
      throw new NotFoundException('Hero not found');
    }

    return hero;
  }
}
