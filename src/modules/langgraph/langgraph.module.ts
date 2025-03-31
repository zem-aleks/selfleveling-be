import { Module } from '@nestjs/common';
import { LanggraphService } from './services/langgraph.service';
import { GoalExtractService } from './services/goal-extract.service';
import { KpiBuildingService } from './services/kpi-building.service';

@Module({
  imports: [],
  providers: [LanggraphService, GoalExtractService, KpiBuildingService],
  exports: [GoalExtractService, KpiBuildingService],
})
export class LanggraphModule {}
