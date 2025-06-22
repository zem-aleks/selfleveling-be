import { Quest } from '../entities/quest.entity';

export const FIRST_QUEST_DATA: Omit<
  Quest,
  'id' | 'createdAt' | 'updatedAt' | 'heroId' | 'userId' | 'deadline'
> = {
  title: 'Build your first goal!',
  description: `Let's start with the building your initial goal that you would like to achieve. It will help to generate a list of needed skills and path for self leveling!`,
  rewards: {
    experience: 100,
    attributesReward: { discipline: 1, health: 3 },
    skillsExperience: {},
  },
  penalties: {
    attributesPenalty: { discipline: 1, health: 50 },
    skillsPenalty: {},
  },
  required: true,
  isInitial: true,
  status: 'active',
};
