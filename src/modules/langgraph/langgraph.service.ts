import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@langchain/langgraph-sdk';
import { HumanMessage } from '@langchain/core/messages';
import {
  ExtractGoalResult,
  GoalExtractionEvent,
} from '../goals/types/extraction';
import { notReachable } from '../../shared/utils/notReachable';

@Injectable()
export class LanggraphService {
  private readonly graphId: string;
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    const apiUrl = this.configService.get('LANGGRAPH_API_URL') as
      | string
      | undefined;

    const graphId = this.configService.get('LANGGRAPH_GRAPH_ID') as
      | string
      | undefined;

    if (!apiUrl || !graphId) {
      throw new Error('LANGGRAPH_API_URL is not defined');
    }

    this.graphId = graphId;
    this.client = new Client({ apiUrl });
  }

  async getThread(threadId: string) {
    const existingThread = await this.client.threads.get(threadId);
    if (existingThread) {
      return existingThread;
    }

    return this.client.threads.create({
      threadId,
      graphId: this.graphId,
    });
  }

  async extractGoal(
    threadId: string,
    goal: string,
  ): Promise<ExtractGoalResult> {
    const thread = await this.getThread(threadId);
    const streamResponse = this.client.runs.stream(
      thread.thread_id,
      this.graphId,
      {
        streamMode: 'updates',
        // TODO: should I add previous messages?
        input: { messages: [new HumanMessage(goal)] },
      },
    );

    let result: ExtractGoalResult = {
      type: 'followUp',
      score: 0,
      followUpQuestion: '',
    };

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
