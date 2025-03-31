import { Module } from '@nestjs/common';
import { KpisController } from './kpis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kpi } from './entities/kpi.entity';
import { KpisService } from './kpis.service';
import { LanggraphModule } from '../langgraph/langgraph.module';
import { GoalsModule } from '../goals/goals.module';

@Module({
  imports: [TypeOrmModule.forFeature([Kpi]), LanggraphModule, GoalsModule],
  controllers: [KpisController],
  providers: [KpisService],
  exports: [],
})
export class KpisModule {}
