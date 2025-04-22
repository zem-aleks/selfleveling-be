import { Injectable } from '@nestjs/common';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { LanggraphService } from './langgraph.service';
import { ChatOpenAI } from '@langchain/openai';
import * as dayjs from 'dayjs';
import { evaluateGoalSchema } from '../schemas/evaluateGoalSchema';
import { GoalEvaluation } from '../../goals/types/entity';
import { z } from 'zod';

@Injectable()
export class GoalExtractService {
  private readonly graphId = 'goalExtraction';

  constructor(private readonly langraphService: LanggraphService) {}

  async evaluateGoal({
    goal,
    targetDate,
  }: {
    goal: string;
    targetDate: string;
  }): Promise<GoalEvaluation> {
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.5,
    }).withStructuredOutput(evaluateGoalSchema);
    return await model.invoke([
      new SystemMessage(
        `Your task is to evaluate the user's goal. The SMART goal stands for Specific, Measurable, Achievable, Relevant, and Time-Bound.
Try to evaluate if the goal is well defined and structured and suggest improvements.
Pay attention if it's really achievable and be more realistic and pessimistic on this estimation. 
Compare to historical data if such achievements are possible for the selected period of time. If not, suggest a more realistic deadline.
If there is at least 1 parameter for measurement, then the goal is measurable and score should be 80 and above.
Overall score 70 and above means that the goal is well defined and structured.
Add extra points if the goal is short and clear.
Today is ${dayjs().format('YYYY-MM-DD')}`,
      ),
      new HumanMessage(`[USER GOAL] ${goal} [END USER GOAL]
[USER SUGGESTED DEADLINE] ${targetDate} [END USER SUGGESTED DEADLINE]`),
    ]);
  }

  async extractGoalTitle(goal: string): Promise<string> {
    const schema = z.object({
      title: z.string().describe('Short goal title'),
    });
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.5,
    }).withStructuredOutput(schema);

    const result = await model.invoke([
      new SystemMessage(
        `Summarize the user's goal and extract a short title for it`,
      ),
      new HumanMessage(`[USER GOAL] ${goal} [END USER GOAL]`),
    ]);

    return result.title;
  }

  //   async extractGoal(
  //     threadId: string,
  //     goal: string,
  //     targetDate: string,
  //   ): Promise<ExtractGoalResult> {
  //     const model = new ChatOpenAI({
  //       model: 'gpt-4o-mini',
  //       temperature: 0,
  //     }).withStructuredOutput(evaluateGoalSchema);
  //
  //     const evaluation = await model.invoke([
  //       new SystemMessage(
  //         `Your task is to evaluate the user's goal. The SMART goal stands for Specific, Measurable, Achievable, Relevant, and Time-Bound.
  // Try to evaluate if the goal is well defined and structured and suggest improvements.
  // Today is ${dayjs().format('YYYY-MM-DD')}`,
  //       ),
  //       new HumanMessage(`[USER GOAL] ${goal} [END USER GOAL]
  // [USER SUGGESTED DEADLINE] ${targetDate} [END USER SUGGESTED DEADLINE]`),
  //     ]);
  //
  //     let result: ExtractGoalResult = {
  //       type: 'followUp',
  //       score: 0,
  //       followUpQuestion: '',
  //     };
  //
  //     const thread = await this.langraphService.getOrCreateThread(
  //       threadId,
  //       this.graphId,
  //     );
  //
  //     const streamResponse = await this.langraphService.runStream({
  //       threadId: thread.thread_id,
  //       graphId: this.graphId,
  //       input: { messages: [new HumanMessage(goal)] },
  //     });
  //
  //     for await (const event of streamResponse) {
  //       switch (event.event) {
  //         case 'updates': {
  //           // TODO: potentially unsafe place, schema validation is needed!
  //           const data = event.data as GoalExtractionEvent;
  //           if ('extractGoalScore' in data) {
  //             result.score = data.extractGoalScore.score;
  //           }
  //
  //           if ('prepareFollowUpQuestion' in data) {
  //             result = {
  //               ...result,
  //               type: 'followUp',
  //               followUpQuestion:
  //                 (data.prepareFollowUpQuestion.messages.at(-1)
  //                   .content as string) || '',
  //             };
  //           }
  //
  //           if ('extractUserGoal' in data) {
  //             result = {
  //               ...result,
  //               type: 'success',
  //               title: data.extractUserGoal.goal.goalTitle,
  //               description: data.extractUserGoal.goal.goalDescription,
  //             };
  //           }
  //
  //           break;
  //         }
  //
  //         case 'error':
  //         case 'metadata':
  //         case 'feedback':
  //           break;
  //
  //         default:
  //           return notReachable(event);
  //       }
  //     }
  //
  //     return result;
  //   }
}
