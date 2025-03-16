import { HeroEntity } from '../types/entity';
import { Hero } from '../entities/hero.entity';

export const mapHeroToEntity = (hero: Hero): HeroEntity => {
  return hero;
};
