import { MeasurementEntity } from './measurement';

export type KpiEntity = {
  id: string;
  title: string;
  description: string;
  targetValue: string;
  status: 'draft' | 'active';
  createdAt: Date;
  updatedAt: Date;
  goalId: string;
};

export type KpiWithMeasurementsEntity = KpiEntity & {
  measurements: MeasurementEntity[];
  currentValue: string;
  startingValue: string;
};
