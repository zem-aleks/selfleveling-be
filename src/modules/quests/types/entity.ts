export type QuestEntity = {
  id: string;
  userId: string;
  heroId: string;
  title: string;
  description: string;
  rewards: QuestRewards;
  penalties: QuestPenalties;
  status: 'active' | 'completed' | 'failed';
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type QuestRewards = {
  experience: number;
  skillsExperience: Record<string, number>; // { skillId: experience }
  attributesReward: Record<string, number>; // { attributeId: experience }
};

export type QuestPenalties = {
  skillsPenalty: Record<string, number>; // { skillId: penalty }
  attributesPenalty: Record<string, number>; // { attributeId: penalty }
};
