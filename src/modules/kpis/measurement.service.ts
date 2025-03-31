import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement } from './entities/measurement.entity';

@Injectable()
export class MeasurementService {
  constructor(
    @InjectRepository(Measurement)
    private readonly repository: Repository<Measurement>,
  ) {}

  async save(entity: Measurement): Promise<Measurement> {
    return this.repository.save(entity);
  }

  async create(entity: {
    kpiId: string;
    goalId: string;
    value: string;
  }): Promise<Measurement> {
    return this.repository.save(entity);
  }

  getByKpiId(kpiId: string) {
    return this.repository.find({ where: { kpiId } });
  }

  getByGoalId(goalId: string) {
    return this.repository.find({ where: { goalId } });
  }

  deleteByKpiId(kpiId: string) {
    return this.repository.delete({ kpiId });
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }
}
