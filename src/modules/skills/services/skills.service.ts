import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { generateSkillsSchema } from '../schemas/generateSkillsSchema';
import { Goal } from '../../goals/entities/goal.entity';
import { NEW_LINE } from '../../../shared/utils/variables';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly repository: Repository<Skill>,
  ) {}

  async createSkills(
    data: Array<{ title: string; description: string }>,
  ): Promise<Skill[]> {
    return this.repository.save(data);
  }

  async save(skill: Skill): Promise<Skill> {
    return this.repository.save(skill);
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  getByIds(ids: string[]) {
    return this.repository.findBy({ id: In(ids) });
  }

  getAll() {
    return this.repository.find();
  }

  async generateSkills(goal: Goal): Promise<Skill[]> {
    const existingSkills = await this.getAll();
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0,
    }).withStructuredOutput(generateSkillsSchema);

    const skillsData = await model.invoke([
      new SystemMessage(
        `Based on the user's goal, suggest 1-8 skills that are needed to achieve it.
Skill should contain title and description. Try to keep title short and catchy. 
There are a few examples: Discipline, Resilience, Strength etc.
Skills must be realistic, because they will be applied in real life. 
Things like Mana or Magic are not realistic.

Below you will find a list of existing skills in the system. If there are good fits to the user's goal, add their ID's to the existingSkills field.
It's nice to have 5 skills in the result. Add preference to existing skills and try to avoid duplicates or synonyms.
However if there are no good fits, create new skills.

Existing skills in database:
${existingSkills.length > 0 ? existingSkills.map((s) => `ID=${s.id} Title=${s.title} ${NEW_LINE}`).join(', ') : 'No skills in database yet'}`,
      ),
      new HumanMessage(
        `Goal title: ${goal.title}. Goal description: ${goal.description}`,
      ),
    ]);

    const skillsMap = new Map(existingSkills.map((skill) => [skill.id, skill]));
    const goalExistingSkills = (skillsData.existingSkillsIds || []).map((id) =>
      skillsMap.get(id),
    );
    const newSkillsData = skillsData.newSkills.map((skill) => ({
      title: skill.title,
      description: skill.description,
    }));
    const newSkills = await this.createSkills(newSkillsData);
    return [...goalExistingSkills, ...newSkills];
  }
}
