import { GoalEntity } from '../types/entity';
import { Goal } from '../entities/goal.entity';
import { notReachable } from '../../../shared/utils/notReachable';

export const mapGoalToEntity = (goal: Goal): GoalEntity => {
  switch (goal.status) {
    case 'draft':
      return { ...goal, status: 'draft' };

    case 'formed':
      return { ...goal, status: 'formed' };

    default:
      return notReachable(goal.status);
  }
};
