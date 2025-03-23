import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { GoalsService } from '../goals.service';
import { Goal } from '../entities/goal.entity';

@Injectable()
export class GoalByIdPipe implements PipeTransform<string, Promise<Goal>> {
  constructor(private readonly goalsService: GoalsService) {}

  async transform(heroId: string): Promise<Goal> {
    const goal = await this.goalsService.getById(heroId);
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return goal;
  }
}
