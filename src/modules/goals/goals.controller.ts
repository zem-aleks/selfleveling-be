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
import { GoalExtractService } from '../langgraph/services/goal-extract.service';
import { KpisService } from '../kpis/services/kpis.service';
import { MeasurementService } from '../kpis/services/measurement.service';
import { AssignedSkillsService } from '../skills/services/assigned-skills.service';
import { mapKpisToEntities } from '../kpis/mappers/mapKpiToEntity';
import { GoalActive, GoalEnhancedEntity } from './types/entity';
import * as dayjs from 'dayjs';
import { notReachable } from '../../shared/utils/notReachable';
import { SkillsService } from '../skills/services/skills.service';

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
    private readonly skillsService: SkillsService,
  ) {}

  @Post()
  async create(
    @AuthUser() user: User,
    @Body('heroId', HeroByIdPipe) hero: Hero,
    @Body() body: { goal: string; targetDate: string },
  ) {
    if (hero.userId !== user.id) {
      throw new NotFoundException(`Hero not found`);
    }

    try {
      const evaluation = await this.goalExtractService.evaluateGoal(body);
      const goal = await this.goalsService.createDraft({
        heroId: hero.id,
        goal: body.goal,
        userId: user.id,
        status: 'draft',
        targetDate: dayjs(body.targetDate).toDate(),
        evaluation,
      });

      return { goal: mapGoalToEntity(goal) };
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Not able to evaluate the goal');
    }
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

    const goals = (await this.goalsService.getActiveByHeroId(
      hero.id,
    )) as GoalActive[];
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
  async updateGoal(
    @AuthUser() user: User,
    @Param('id', GoalByIdPipe) goal: Goal,
    @Body() body: { goal: string; targetDate: string },
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
      const evaluation = await this.goalExtractService.evaluateGoal(body);
      const updatedGoal = await this.goalsService.save({
        ...goal,
        evaluation,
        goal: body.goal,
        targetDate: dayjs(body.targetDate).toDate(),
      });

      return { goal: mapGoalToEntity(updatedGoal) };
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Not able to evaluate the goal');
    }
  }

  @Patch(':id')
  async acceptGoal(
    @AuthUser() user: User,
    @Param('id', GoalByIdPipe) goal: Goal,
  ) {
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    switch (goal.status) {
      case 'draft': {
        const shortGoalTitle = await this.goalExtractService.extractGoalTitle(
          goal.goal,
        );
        const formedGoal = await this.goalsService.save({
          ...goal,
          title: shortGoalTitle,
          status: 'formed',
        });
        return mapGoalToEntity(formedGoal);
      }

      case 'formed': {
        const kpis = await this.kpisService.getActiveKpisByGoalId(goal.id);
        if (kpis.length === 0) {
          throw new BadRequestException(`Goal should have at least one KPI`);
        }

        // TODO: generate skills
        const assignedSkills =
          await this.assignedSkillsService.getGoalAssignedSkills(goal.id);

        if (assignedSkills.length === 0) {
          const newSkills = await this.skillsService.generateSkills(goal);
          const assignedNewSkills =
            await this.assignedSkillsService.assignSkillsToGoal(
              newSkills,
              goal,
            );

          console.log(assignedNewSkills);
        }

        const reviewGoal = await this.goalsService.save({
          ...goal,
          status: 'review',
        });

        // TODO: we can add skills
        return mapGoalToEntity(reviewGoal);
      }

      case 'review': {
        await this.assignedSkillsService.activateGoalSkills(goal.id);
        const activeGoal = await this.goalsService.save({
          ...goal,
          status: 'active',
        });
        return mapGoalToEntity(activeGoal);
      }

      case 'active':
        throw new BadRequestException(`Goal is already activated`);

      default:
        return notReachable(goal.status);
    }
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
