import { z } from 'zod';

export const generateSkillsSchema = z.object({
  newSkills: z
    .array(
      z.object({
        title: z.string().describe('Skill title'),
        description: z.string().describe('Skill description'),
      }),
    )
    .describe("List of new skills needed to achieve the user's goal"),

  existingSkillsIds: z
    .array(z.string())
    .describe(
      `List of ID's of existing skills that needed to achieve the user's goal`,
    ),
});
