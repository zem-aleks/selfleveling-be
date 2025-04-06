import { KpiWithMeasurementsEntity } from '../../kpis/types/entity';

type GoalCommonFields = {
  id: string;
  userId: string;
  heroId: string;
  threadId: string;
  score: number;
};

export type GoalDraft = GoalCommonFields & {
  goal: string;
  status: 'draft';
  followUpQuestion: string;
};

export type GoalFormed = GoalCommonFields & {
  title: string;
  description: string;
  status: 'formed';
};

export type GoalActive = Omit<GoalFormed, 'status'> & {
  status: 'active';
};

export type GoalEntity = GoalDraft | GoalFormed | GoalActive;

export type GoalEnhancedEntity = GoalActive & {
  kpis: KpiWithMeasurementsEntity[];
};
