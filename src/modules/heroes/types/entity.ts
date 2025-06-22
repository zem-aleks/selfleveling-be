import { AttributeId } from '../../attributes/types/attribute';

export type HeroEntity = {
  id: string;
  userId: string;
  name: string;
  language: string;
  experience: number;
  experienceToLevelUp: number;
  levelProgress: number;
  level: number;
  attributes: HeroAttribute[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type HeroAttribute = {
  attributeId: AttributeId;
  value: number;
};
