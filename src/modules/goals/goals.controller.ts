import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../../shared/decorators/auth.decorator';
import { User } from '@supabase/supabase-js';
import { HeroByIdPipe } from '../heroes/pipes/hero-by-id.pipe';
import { Hero } from '../heroes/entities/hero.entity';
import { LanggraphService } from '../langgraph/langgraph.service';
import { GoalsService } from './goals.service';
import { mapGoalToEntity } from './mappers/mapGoalToEntity';
import { GoalByIdPipe } from './pipes/goal-by-id.pipe';
import { Goal } from './entities/goal.entity';
import { HeroesService } from '../heroes/heroes.service';
import { mapHeroToEntity } from '../heroes/mappers/mapHeroToEntity';
import { notReachable } from '../../shared/utils/notReachable';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(
    private readonly langgraphService: LanggraphService,
    private readonly goalsService: GoalsService,
    private readonly heroesService: HeroesService,
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
      const goalResult = await this.langgraphService.extractGoal(
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
      const goalResult = await this.langgraphService.extractGoal(
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
}
