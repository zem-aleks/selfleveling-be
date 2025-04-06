export type SkillStatus = 'draft' | 'active';

export type SkillEntity = {
  id: string;
  title: string;
  description: string;
  logoFilename: string;
  howManyTimesUsed: number;
  rating: number;
  vote: -1 | 0 | 1;
  level: number;
  experience: number;
  experienceToLevelUp: number;
  levelProgress: number;
  status: SkillStatus;
  goalId: string;
  heroId: string;
};
