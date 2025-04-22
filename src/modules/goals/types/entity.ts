import { KpiWithMeasurementsEntity } from '../../kpis/types/entity';
import { SkillEntity } from '../../skills/types/entity';

export type GoalEvaluation = {
  specificScore: number;
  achievableScore: number;
  measurableScore: number;
  overallScore: number;
  followUpQuestion: string;
  improvedGoal: string;
};

type GoalCommonFields = {
  id: string;
  userId: string;
  heroId: string;
  threadId: string;
  targetDate: Date;
  evaluation: GoalEvaluation;
  goal: string;
};

export type GoalDraft = GoalCommonFields & {
  status: 'draft';
};

export type GoalFormed = GoalCommonFields & {
  title: string;
  status: 'formed';
};

export type GoalReview = Omit<GoalFormed, 'status'> & {
  status: 'review';
};

export type GoalActive = Omit<GoalReview, 'status'> & {
  status: 'active';
};

export type GoalEntity = GoalDraft | GoalFormed | GoalActive | GoalReview;

export type GoalReviewWithSkills = GoalReview & {
  skills: SkillEntity[];
};

export type GoalEnhancedEntity = GoalActive & {
  kpis: KpiWithMeasurementsEntity[];
};
