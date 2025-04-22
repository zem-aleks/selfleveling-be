import { z } from 'zod';

export const evaluateGoalSchema = z.object({
  specificScore: z
    .number()
    .describe('How much this goal is specific from 0 to 100 points?'),

  achievableScore: z
    .number()
    .describe(
      'How much this goal is achievable from 0 to 100 points? 100 means absolutely achievable',
    ),

  measurableScore: z
    .number()
    .describe(
      'How difficult to measure this goal from 0 to 100 points? 0 means there is no way to measure it',
    ),

  overallScore: z
    .number()
    .describe(`How well defined is the goal? 100 means it's well defined`),

  followUpQuestion: z
    .string()
    .describe(
      'A follow up question that can help a user to improve the goal and get higher scores',
    ),

  improvedGoal: z.string().describe('Example of how the goal can be improved'),
});
