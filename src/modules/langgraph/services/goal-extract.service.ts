import { Injectable } from '@nestjs/common';
import { HumanMessage } from '@langchain/core/messages';
import {
  ExtractGoalResult,
  GoalExtractionEvent,
} from '../types/goalExtraction';
import { notReachable } from '../../../shared/utils/notReachable';
import { LanggraphService } from './langgraph.service';

@Injectable()
export class GoalExtractService {
  private readonly graphId = 'goalExtraction';

  constructor(private readonly langraphService: LanggraphService) {}

  async extractGoal(
    threadId: string,
    goal: string,
  ): Promise<ExtractGoalResult> {
    let result: ExtractGoalResult = {
      type: 'followUp',
      score: 0,
      followUpQuestion: '',
    };

    const thread = await this.langraphService.getOrCreateThread(
      threadId,
      this.graphId,
    );

    const streamResponse = await this.langraphService.runStream({
      threadId: thread.thread_id,
      graphId: this.graphId,
      input: { messages: [new HumanMessage(goal)] },
    });

    for await (const event of streamResponse) {
      switch (event.event) {
        case 'updates': {
          // TODO: potentially unsafe place, schema validation is needed!
          const data = event.data as GoalExtractionEvent;
          if ('extractGoalScore' in data) {
            result.score = data.extractGoalScore.score;
          }

          if ('prepareFollowUpQuestion' in data) {
            result = {
              ...result,
              type: 'followUp',
              followUpQuestion:
                (data.prepareFollowUpQuestion.messages.at(-1)
                  .content as string) || '',
            };
          }

          if ('extractUserGoal' in data) {
            result = {
              ...result,
              type: 'success',
              title: data.extractUserGoal.goal.goalTitle,
              description: data.extractUserGoal.goal.goalDescription,
            };
          }

          break;
        }

        case 'error':
        case 'metadata':
        case 'feedback':
          break;

        default:
          return notReachable(event);
      }
    }

    return result;
  }
}
