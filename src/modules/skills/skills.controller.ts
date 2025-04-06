import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../../shared/decorators/auth.decorator';
import { User } from '@supabase/supabase-js';
import { SkillsService } from './services/skills.service';
import { GoalByIdPipe } from '../goals/pipes/goal-by-id.pipe';
import { Goal } from '../goals/entities/goal.entity';
import { AssignedSkillsService } from './services/assigned-skills.service';
import { mapSkillsToEntities } from './mappers/mapSkillToEntity';
import { SkillEntity } from './types/entity';
import { HeroByIdPipe } from '../heroes/pipes/hero-by-id.pipe';
import { Hero } from '../heroes/entities/hero.entity';

@Controller('skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly assignedSkillsService: AssignedSkillsService,
  ) {}

  @Get()
  async getGoalSkills(
    @AuthUser() user: User,
    @Query('goalId', GoalByIdPipe) goal: Goal,
  ): Promise<SkillEntity[]> {
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    const assignedSkills =
      await this.assignedSkillsService.getGoalAssignedSkills(goal.id);

    if (assignedSkills.length > 0) {
      const skills = await this.skillsService.getByIds(
        assignedSkills.map((s) => s.skillId),
      );
      return mapSkillsToEntities(skills, assignedSkills);
    }

    const newSkills = await this.skillsService.generateSkills(goal);
    const assignedNewSkills =
      await this.assignedSkillsService.assignSkillsToGoal(newSkills, goal);

    return mapSkillsToEntities(newSkills, assignedNewSkills);
  }

  @Get('hero')
  async getHeroSkills(
    @AuthUser() user: User,
    @Query('heroId', HeroByIdPipe) hero: Hero,
  ): Promise<SkillEntity[]> {
    if (hero.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    const assignedSkills =
      await this.assignedSkillsService.getHeroAssignedSkills(hero.id);

    if (assignedSkills.length > 0) {
      const skills = await this.skillsService.getByIds(
        assignedSkills.map((s) => s.skillId),
      );
      return mapSkillsToEntities(skills, assignedSkills);
    }

    return [];
  }
}
