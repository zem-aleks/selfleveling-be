import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../../shared/decorators/auth.decorator';
import { User } from '@supabase/supabase-js';
import { HeroByIdPipe } from '../heroes/pipes/hero-by-id.pipe';
import { Hero } from '../heroes/entities/hero.entity';
import { QuestEntity } from './types/entity';
import { QuestsService } from './quests.service';
import { mapQuestToEntity } from './mappers/mapQuestToEntity';

@Controller('quests')
@UseGuards(JwtAuthGuard)
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get('hero/:heroId/:status?')
  async getHeroQuests(
    @AuthUser() user: User,
    @Param('heroId', HeroByIdPipe) hero: Hero,
    // @Param('status') status?: QuestStatus,
  ): Promise<QuestEntity[]> {
    if (hero.userId !== user.id) {
      throw new NotFoundException(`Hero not found`);
    }

    const quests = await this.questsService.getByHeroId(hero.id);

    return quests.map(mapQuestToEntity);
  }
}
