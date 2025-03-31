import { KpiEntity, KpiWithMeasurementsEntity } from '../types/entity';
import { Kpi } from '../entities/kpi.entity';
import { Measurement } from '../entities/measurement.entity';

export const mapKpiToEntity = (kpi: Kpi): KpiEntity => {
  return kpi;
};

export const mapKpiToEntityWithMeasurements = (
  kpi: Kpi,
  measurements: Measurement[],
): KpiWithMeasurementsEntity => {
  return {
    ...kpi,
    measurements,
  };
};
