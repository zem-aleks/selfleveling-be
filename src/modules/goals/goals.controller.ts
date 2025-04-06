import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../../shared/decorators/auth.decorator';
import { User } from '@supabase/supabase-js';
import { HeroByIdPipe } from '../heroes/pipes/hero-by-id.pipe';
import { Hero } from '../heroes/entities/hero.entity';
import { GoalsService } from './goals.service';
import { mapGoalToEntity } from './mappers/mapGoalToEntity';
import { GoalByIdPipe } from './pipes/goal-by-id.pipe';
import { Goal } from './entities/goal.entity';
import { HeroesService } from '../heroes/heroes.service';
import { mapHeroToEntity } from '../heroes/mappers/mapHeroToEntity';
import { notReachable } from '../../shared/utils/notReachable';
import { GoalExtractService } from '../langgraph/services/goal-extract.service';
import { KpisService } from '../kpis/services/kpis.service';
import { MeasurementService } from '../kpis/services/measurement.service';
import { AssignedSkillsService } from '../skills/services/assigned-skills.service';
import {
  mapKpisToEntities,
  mapKpiToEntityWithMeasurements,
} from '../kpis/mappers/mapKpiToEntity';
import { GoalEnhancedEntity } from './types/entity';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(
    private readonly goalExtractService: GoalExtractService,
    private readonly goalsService: GoalsService,
    private readonly heroesService: HeroesService,
    private readonly kpisService: KpisService,
    private readonly measurementsService: MeasurementService,
    private readonly assignedSkillsService: AssignedSkillsService,
  ) {}

  @Post()
  async create(
    @AuthUser() user: User,
    @Body('heroId', HeroByIdPipe) hero: Hero,
    @Body() body: { goal: string },
  ) {
    if (hero.userId !== user.id) {
      throw new NotFoundException(`Hero not found`);
    }

    const goal = await this.goalsService.createDraft({
      heroId: hero.id,
      goal: body.goal,
      userId: user.id,
      status: 'draft',
    });

    try {
      const goalResult = await this.goalExtractService.extractGoal(
        goal.threadId,
        body.goal,
      );

      switch (goalResult.type) {
        case 'followUp':
          await this.goalsService.save({
            ...goal,
            score: goalResult.score,
            followUpQuestion: goalResult.followUpQuestion,
          });
          break;

        case 'success':
          await this.goalsService.save({
            ...goal,
            score: goalResult.score,
            title: goalResult.title,
            description: goalResult.description,
          });
          break;

        default:
          return notReachable(goalResult);
      }
    } catch (e) {
      console.error(e);
      await this.goalsService.save({
        ...goal,
        followUpQuestion:
          'Your goal is not clear. Could you please rephrase it?',
      });
    }

    return { goal: mapGoalToEntity(goal) };
  }

  @Get(':id')
  async getGoal(@AuthUser() user: User, @Param('id', GoalByIdPipe) goal: Goal) {
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    const hero = await this.heroesService.getById(goal.heroId);
    if (!hero) {
      throw new NotFoundException(`Hero not found`);
    }

    if (hero.userId !== user.id) {
      throw new NotFoundException(`Hero not found`);
    }

    return { goal: mapGoalToEntity(goal), hero: mapHeroToEntity(hero) };
  }

  @Get('hero/:heroId/active')
  async getHeroGoals(
    @AuthUser() user: User,
    @Param('heroId', HeroByIdPipe) hero: Hero,
  ): Promise<GoalEnhancedEntity[]> {
    if (hero.userId !== user.id) {
      throw new NotFoundException(`Hero not found`);
    }

    const goals = await this.goalsService.getActiveByHeroId(hero.id);
    // TODO: refactor, to prevent requests in the loop
    const promises = goals.map(async (goal) => {
      const kpis = await this.kpisService.getActiveKpisByGoalId(goal.id);
      const measurements = await this.measurementsService.getByGoalId(goal.id);
      const goalEnhanced: GoalEnhancedEntity = {
        ...goal,
        status: 'active',
        kpis: mapKpisToEntities(kpis, measurements),
      };

      return goalEnhanced;
    });

    return await Promise.all(promises);
  }

  @Get('hero/:heroId/draft')
  async getHeroGoalDrafts(
    @AuthUser() user: User,
    @Param('heroId', HeroByIdPipe) hero: Hero,
  ) {
    if (hero.userId !== user.id) {
      throw new NotFoundException(`Hero not found`);
    }

    const goals = await this.goalsService.getDraftsByHero(hero.id);
    return goals.map(mapGoalToEntity);
  }

  @Put(':id')
  async addGoalDetails(
    @AuthUser() user: User,
    @Param('id', GoalByIdPipe) goal: Goal,
    @Body() body: { goal: string },
  ) {
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    const hero = await this.heroesService.getById(goal.heroId);
    if (!hero) {
      throw new NotFoundException(`Hero not found`);
    }

    if (hero.userId !== user.id) {
      throw new NotFoundException(`Hero not found`);
    }

    try {
      const goalResult = await this.goalExtractService.extractGoal(
        goal.threadId,
        body.goal,
      );

      switch (goalResult.type) {
        case 'followUp':
          await this.goalsService.save({
            ...goal,
            score: goalResult.score,
            followUpQuestion: goalResult.followUpQuestion,
          });
          break;

        case 'success':
          await this.goalsService.save({
            ...goal,
            score: goalResult.score,
            title: goalResult.title,
            description: goalResult.description,
            status: 'formed',
          });
          break;

        default:
          return notReachable(goalResult);
      }
    } catch (e) {
      console.error(e);
      await this.goalsService.save({
        ...goal,
        followUpQuestion:
          'Your goal is not clear. Could you please rephrase it?',
      });
    }

    return { goal: mapGoalToEntity(goal) };
  }

  @Patch(':id')
  async acceptGoal(
    @AuthUser() user: User,
    @Param('id', GoalByIdPipe) goal: Goal,
  ) {
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    if (goal.status !== 'formed') {
      throw new BadRequestException(`Goal is not formed`);
    }

    await this.assignedSkillsService.activateGoalSkills(goal.id);
    await this.goalsService.save({
      ...goal,
      status: 'active',
    });
  }

  @Delete(':id')
  async deleteGoal(
    @AuthUser() user: User,
    @Param('id', GoalByIdPipe) goal: Goal,
  ) {
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    // TODO: depends on status deletion should be different

    await this.measurementsService.deleteMeasurementsByGoalId(goal.id);
    await this.kpisService.deleteKpisByGoalId(goal.id);
    await this.assignedSkillsService.deleteAssignedSkillsByGoalId(goal.id);
    await this.goalsService.delete(goal.id);

    return;
  }
}
