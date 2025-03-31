import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../../shared/decorators/auth.decorator';
import { User } from '@supabase/supabase-js';
import { KpisService } from './kpis.service';
import { mapKpiToEntity } from './mappers/mapKpiToEntity';
import { Goal } from '../goals/entities/goal.entity';
import { GoalByIdPipe } from '../goals/pipes/goal-by-id.pipe';
import { KpiBuildingService } from '../langgraph/services/kpi-building.service';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';
import { GoalFormed } from '../goals/types/entity';

@Controller('kpis')
@UseGuards(JwtAuthGuard)
export class KpisController {
  constructor(
    private readonly kpiBuildingService: KpiBuildingService,
    private readonly kpisService: KpisService,
  ) {}

  // @Post()
  // async create(
  //   @AuthUser() user: User,
  //   @Body('goalId', HeroByIdPipe) hero: Hero,
  //   @Body() body: { goal: string },
  // ) {
  //   if (hero.userId !== user.id) {
  //     throw new NotFoundException(`Hero not found`);
  //   }
  //
  //   const goal = await this.goalsService.createDraft({
  //     heroId: hero.id,
  //     goal: body.goal,
  //     userId: user.id,
  //     status: 'draft',
  //   });
  //
  //   try {
  //     const goalResult = await this.langgraphService.extractGoal(
  //       goal.threadId,
  //       body.goal,
  //     );
  //
  //     switch (goalResult.type) {
  //       case 'followUp':
  //         await this.goalsService.save({
  //           ...goal,
  //           score: goalResult.score,
  //           followUpQuestion: goalResult.followUpQuestion,
  //         });
  //         break;
  //
  //       case 'success':
  //         await this.goalsService.save({
  //           ...goal,
  //           score: goalResult.score,
  //           title: goalResult.title,
  //           description: goalResult.description,
  //         });
  //         break;
  //
  //       default:
  //         return notReachable(goalResult);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     await this.goalsService.save({
  //       ...goal,
  //       followUpQuestion:
  //         'Your goal is not clear. Could you please rephrase it?',
  //     });
  //   }
  //
  //   return { goal: mapKpiToEntity(goal) };
  // }

  @Get()
  async getDraftKpis(
    @AuthUser() user: User,
    @Query('goalId', GoalByIdPipe) goal: Goal,
  ) {
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    if (goal.status !== 'formed') {
      throw new BadRequestException(`Goal is not formed`);
    }

    const drafts = await this.kpisService.getDraftsByGoalId(goal.id);
    if (drafts.length > 0) {
      return drafts.map(mapKpiToEntity);
    }

    const suggestedKpis = await this.kpiBuildingService.buildKpis(
      uuid(),
      goal as GoalFormed,
    );

    console.log(suggestedKpis);

    const kpis = await this.kpisService.saveDrafts(
      suggestedKpis.map((kpi) => ({
        status: 'draft',
        title: kpi.title,
        description: kpi.description,
        targetValue: kpi.targetValue,
        goalId: goal.id,
      })),
    );

    return kpis.map(mapKpiToEntity);
  }
}
