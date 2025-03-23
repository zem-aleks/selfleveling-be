import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@langchain/langgraph-sdk';
import { ChatMessage, HumanMessage } from '@langchain/core/messages';
import { ExtractGoalResult, GoalExtractionEvent } from '../goals/types/entity';

@Injectable()
export class LanggraphService {
  private readonly assistantId: string;
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    const apiUrl = this.configService.get('LANGGRAPH_API_URL') as
      | string
      | undefined;

    const assistantId = this.configService.get('LANGGRAPH_ASSISTANT_ID') as
      | string
      | undefined;

    if (!apiUrl || !assistantId) {
      throw new Error('LANGGRAPH_API_URL is not defined');
    }

    this.assistantId = assistantId;
    this.client = new Client({ apiUrl });
  }

  async extractGoal(
    threadId: string,
    goal: string,
  ): Promise<ExtractGoalResult> {
    const thread = await this.client.threads.create({
      threadId,
      graphId: this.assistantId,
    });

    const streamResponse = this.client.runs.stream(
      thread.thread_id,
      this.assistantId,
      {
        streamMode: 'updates',
        input: { messages: [new HumanMessage(goal)] },
      },
    );

    const result: ExtractGoalResult = {
      type: 'followUp',
      score: 0,
      followUpQuestion: '',
    };
    for await (const event of streamResponse) {
      if (event.event === 'updates') {
        // TODO: potentially unsafe place, schema validation is needed!
        const data = event.data as GoalExtractionEvent;
        if ('extractGoalScore' in data) {
          result.score = data.extractGoalScore.score;
        }

        if ('prepareFollowUpQuestion' in data) {
          result.followUpQuestion =
            (data.prepareFollowUpQuestion.messages.at(-1).content as string) ||
            '';
        }
      }
    }

    return result;
  }
}
