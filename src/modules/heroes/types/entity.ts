import { AttributeId } from '../../attributes/types/attribute';

export type HeroEntity = {
  id: string;
  userId: string;
  name: string;
  language: string;
  attributes: HeroAttribute[];
  createdAt: Date;
  updatedAt: Date;
};

export type HeroAttribute = {
  attributeId: AttributeId;
  value: number;
};
