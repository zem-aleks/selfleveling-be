import { SkillEntity } from '../types/entity';
import { Skill } from '../entities/skill.entity';
import { AssignedSkill } from '../entities/assigned-skill.entity';

export const mapSkillToEntity = (
  skill: Skill,
  assignedSkill: AssignedSkill,
): SkillEntity => {
  return {
    id: skill.id,
    title: skill.title,
    description: skill.description,
    logoFilename: skill.logoFilename,
    howManyTimesUsed: skill.howManyTimesUsed,
    rating: skill.rating,
    vote: assignedSkill.vote,
    level: assignedSkill.level,
    experience: assignedSkill.experience,
    goalId: assignedSkill.goalId,
    heroId: assignedSkill.heroId,
  };
};

export const mapSkillsToEntities = (
  skills: Skill[],
  assignedSkills: AssignedSkill[],
): SkillEntity[] => {
  const skillsMap = new Map(skills.map((skill) => [skill.id, skill]));
  return assignedSkills.map((assignedSkill) => {
    const skill = skillsMap.get(assignedSkill.skillId);
    if (!skill) {
      throw new Error(`Skill with id ${assignedSkill.skillId} not found`);
    }

    return mapSkillToEntity(skill, assignedSkill);
  });
};
