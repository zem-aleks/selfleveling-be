import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../../shared/decorators/auth.decorator';
import { User } from '@supabase/supabase-js';
import { KpisService } from './services/kpis.service';
import {
  mapKpisToEntities,
  mapKpiToEntityWithMeasurements,
} from './mappers/mapKpiToEntity';
import { Goal } from '../goals/entities/goal.entity';
import { GoalByIdPipe } from '../goals/pipes/goal-by-id.pipe';
import { KpiBuildingService } from '../langgraph/services/kpi-building.service';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';
import { GoalFormed } from '../goals/types/entity';
import { GoalsService } from '../goals/goals.service';
import { SaveKpiData, SaveKpiFormSchema } from './types/data';
import { MeasurementService } from './services/measurement.service';

@Controller('kpis')
@UseGuards(JwtAuthGuard)
export class KpisController {
  constructor(
    private readonly kpiBuildingService: KpiBuildingService,
    private readonly kpisService: KpisService,
    private readonly goalsService: GoalsService,
    private readonly measurementService: MeasurementService,
  ) {}

  @Patch(':id')
  async saveKpi(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() data: SaveKpiData,
  ) {
    const kpi = await this.kpisService.getById(id);
    const goal = await this.goalsService.getById(kpi.goalId);
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    const validation = SaveKpiFormSchema.safeParse(data);
    if (!validation.success) {
      throw new BadRequestException(validation.error.errors[0].message);
    }

    const updatedKpi = await this.kpisService.save({
      ...kpi,
      status: data.status,
      title: data.title,
      description: data.description,
      targetValue: data.targetValue,
    });

    await this.measurementService.deleteByKpiId(updatedKpi.id);

    const measurement = await this.measurementService.create({
      kpiId: updatedKpi.id,
      goalId: updatedKpi.goalId,
      value: data.currentValue,
    });

    return mapKpiToEntityWithMeasurements(updatedKpi, [measurement]);
  }

  @Get()
  async getDraftKpis(
    @AuthUser() user: User,
    @Query('goalId', GoalByIdPipe) goal: Goal,
  ) {
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    if (goal.status !== 'formed') {
      throw new BadRequestException(`Goal is not formed`);
    }

    const drafts = await this.kpisService.getKpisByGoalId(goal.id);
    if (drafts.length > 0) {
      const measurements = await this.measurementService.getByGoalId(goal.id);
      return mapKpisToEntities(drafts, measurements);
    }

    const suggestedKpis = await this.kpiBuildingService.buildKpis(
      uuid(),
      goal as GoalFormed,
    );

    const kpis = await this.kpisService.saveDrafts(
      suggestedKpis.map((kpi) => ({
        status: 'draft',
        title: kpi.title,
        description: kpi.description,
        targetValue: kpi.targetValue,
        goalId: goal.id,
      })),
    );

    return mapKpisToEntities(kpis, []);
  }

  @Get('active')
  async getGoalKpis(
    @AuthUser() user: User,
    @Query('goalId', GoalByIdPipe) goal: Goal,
  ) {
    if (goal.userId !== user.id) {
      throw new NotFoundException(`Goal not found`);
    }

    const kpis = await this.kpisService.getActiveKpisByGoalId(goal.id);
    const measurements = await this.measurementService.getByGoalId(goal.id);
    return mapKpisToEntities(kpis, measurements);
  }
}
