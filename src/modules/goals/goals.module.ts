import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { HeroesModule } from '../heroes/heroes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { GoalsService } from './goals.service';
import { LanggraphModule } from '../langgraph/langgraph.module';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), HeroesModule, LanggraphModule],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [],
})
export class GoalsModule {}
