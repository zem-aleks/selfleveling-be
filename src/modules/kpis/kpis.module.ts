import { Module } from '@nestjs/common';
import { KpisController } from './kpis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kpi } from './entities/kpi.entity';
import { KpisService } from './kpis.service';
import { LanggraphModule } from '../langgraph/langgraph.module';
import { GoalsModule } from '../goals/goals.module';
import { MeasurementService } from './measurement.service';
import { Measurement } from './entities/measurement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kpi, Measurement]),
    LanggraphModule,
    GoalsModule,
  ],
  controllers: [KpisController],
  providers: [KpisService, MeasurementService],
  exports: [],
})
export class KpisModule {}
