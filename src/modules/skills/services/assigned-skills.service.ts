import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignedSkill } from '../entities/assigned-skill.entity';
import { Skill } from '../entities/skill.entity';
import { Goal } from '../../goals/entities/goal.entity';

@Injectable()
export class AssignedSkillsService {
  constructor(
    @InjectRepository(AssignedSkill)
    private readonly repository: Repository<AssignedSkill>,
  ) {}

  getGoalAssignedSkills(goalId: string) {
    return this.repository.find({
      where: { goalId },
      order: { createdAt: 'ASC' },
    });
  }

  getHeroAssignedSkills(heroId: string) {
    return this.repository.find({
      where: { heroId },
      order: { createdAt: 'ASC' },
    });
  }

  assignSkillsToGoal(skills: Skill[], goal: Goal): Promise<AssignedSkill[]> {
    const assignedSkills = skills.map((skill) => ({
      skillId: skill.id,
      goalId: goal.id,
      heroId: goal.heroId,
    }));

    return this.repository.save(assignedSkills);
  }
}
