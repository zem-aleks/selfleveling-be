import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { SkillsService } from './services/skills.service';
import { AssignedSkill } from './entities/assigned-skill.entity';
import { GoalsModule } from '../goals/goals.module';
import { AssignedSkillsService } from './services/assigned-skills.service';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, AssignedSkill]), GoalsModule],
  controllers: [SkillsController],
  providers: [SkillsService, AssignedSkillsService],
  exports: [SkillsService, AssignedSkillsService],
})
export class SkillsModule {}
