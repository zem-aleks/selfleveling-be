import { HeroEntity } from '../types/entity';
import { Hero } from '../entities/hero.entity';
import { getXpForLevel } from '../../skills/helpers/getXpForLevel';

export const mapHeroToEntity = (hero: Hero): HeroEntity => {
  const currentLevelXp = getXpForLevel(hero.level - 1);
  const expToNextLevel = getXpForLevel(hero.level);
  const levelProgress = Math.round(
    (hero.experience - currentLevelXp) / (expToNextLevel - currentLevelXp),
  );
  return {
    ...hero,
    experienceToLevelUp: expToNextLevel,
    levelProgress,
  };
};
