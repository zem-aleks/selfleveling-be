import { GoalEntity } from '../types/entity';
import { Goal } from '../entities/goal.entity';

export const mapGoalToEntity = (goal: Goal): GoalEntity => {
  return goal as GoalEntity;
  // switch (goal.status) {
  //   case 'draft':
  //     return { ...goal, status: 'draft' };
  //
  //   case 'formed':
  //     return { ...goal, status: 'formed' };
  //
  //   case 'active':
  //     return { ...goal, status: 'active' };
  //
  //   default:
  //     return notReachable(goal.status);
  // }
};
