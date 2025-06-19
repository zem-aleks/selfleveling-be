import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { QuestsService } from '../quests.service';
import { Quest } from '../entities/quest.entity';

@Injectable()
export class QuestByIdPipe implements PipeTransform<string, Promise<Quest>> {
  constructor(private readonly questsService: QuestsService) {}

  async transform(questId: string): Promise<Quest> {
    const quest = await this.questsService.getById(questId);
    if (!quest) {
      throw new NotFoundException('Quest not found');
    }

    return quest;
  }
}
