import { Injectable } from '@nestjs/common';
import { LanggraphService } from './langgraph.service';
import { GoalFormed } from '../../goals/types/entity';
import { SuggestedKpi, SuggestKpisEvent } from '../types/kpiBuilding';
import { notReachable } from '../../../shared/utils/notReachable';

@Injectable()
export class KpiBuildingService {
  private readonly graphId = 'kpiBuilding';

  constructor(private readonly langraphService: LanggraphService) {}

  async buildKpis(threadId: string, goal: GoalFormed): Promise<SuggestedKpi[]> {
    const thread = await this.langraphService.createThread(
      threadId,
      this.graphId,
    );

    const streamResponse = await this.langraphService.runStream({
      threadId: thread.thread_id,
      graphId: this.graphId,
      input: { goalTitle: goal.title, goalDescription: '' },
    });

    for await (const event of streamResponse) {
      switch (event.event) {
        case 'updates': {
          // TODO: potentially unsafe place, schema validation is needed!
          const data = event.data as SuggestKpisEvent;
          return data.suggestKpis.kpis.kpis;
        }

        case 'error':
        case 'metadata':
        case 'feedback':
          break;

        default:
          return notReachable(event);
      }
    }

    return [];
  }
}
