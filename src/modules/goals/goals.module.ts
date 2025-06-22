import { forwardRef, Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { HeroesModule } from '../heroes/heroes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { GoalsService } from './goals.service';
import { LanggraphModule } from '../langgraph/langgraph.module';
import { KpisModule } from '../kpis/kpis.module';
import { SkillsModule } from '../skills/skills.module';
import { QuestsModule } from '../quests/quests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal]),
    HeroesModule,
    LanggraphModule,
    forwardRef(() => KpisModule),
    forwardRef(() => SkillsModule),
    forwardRef(() => QuestsModule),
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
