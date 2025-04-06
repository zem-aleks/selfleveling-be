import { forwardRef, Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { SkillsService } from './services/skills.service';
import { AssignedSkill } from './entities/assigned-skill.entity';
import { GoalsModule } from '../goals/goals.module';
import { AssignedSkillsService } from './services/assigned-skills.service';
import { HeroesModule } from '../heroes/heroes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Skill, AssignedSkill]),
    forwardRef(() => GoalsModule),
    forwardRef(() => HeroesModule),
  ],
  controllers: [SkillsController],
  providers: [SkillsService, AssignedSkillsService],
  exports: [SkillsService, AssignedSkillsService],
})
export class SkillsModule {}
