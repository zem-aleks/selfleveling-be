import { GoalEntity } from '../types/entity';
import { Goal } from '../entities/goal.entity';

export const mapGoalToEntity = (goal: Goal): GoalEntity => {
  return { ...goal };
};
