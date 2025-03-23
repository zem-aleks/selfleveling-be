import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
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
    @Body() { goal }: { goal: string },
  ) {
    if (hero.userId !== user.id) {
      throw new NotFoundException(`Hero not found`);
    }

    const goalEntity = await this.goalsService.createDraft({
      heroId: hero.id,
      goal,
      userId: user.id,
      status: 'draft',
    });

    // TODO: no awaiting, since we make it in parallel
    const goalResult = this.langgraphService.extractGoal(
      goalEntity.threadId,
      goal,
    );

    console.log('goalResult', goalResult);

    return { goal: mapGoalToEntity(goalEntity) };
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
}
