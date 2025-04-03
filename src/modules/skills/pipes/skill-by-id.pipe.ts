import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { SkillsService } from '../services/skills.service';
import { Skill } from '../entities/skill.entity';

@Injectable()
export class SkillByIdPipe implements PipeTransform<string, Promise<Skill>> {
  constructor(private readonly skillService: SkillsService) {}

  async transform(id: string): Promise<Skill> {
    const skill = await this.skillService.getById(id);
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }
}
