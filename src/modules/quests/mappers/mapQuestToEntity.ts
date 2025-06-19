import { QuestEntity } from '../types/entity';
import { Quest } from '../entities/quest.entity';

export const mapQuestToEntity = (quest: Quest): QuestEntity => {
  return quest;
};
