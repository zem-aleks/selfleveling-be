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

export const mapKpisToEntities = (
  kpis: Kpi[],
  measurements: Measurement[],
): KpiWithMeasurementsEntity[] => {
  const measurementsMap = measurements.reduce<Record<string, Measurement[]>>(
    (acc, measurement) => {
      if (!acc[measurement.kpiId]) {
        acc[measurement.kpiId] = [];
      }
      acc[measurement.kpiId].push(measurement);
      return acc;
    },
    {},
  );

  return kpis.map((kpi) => ({
    ...kpi,
    measurements: measurementsMap[kpi.id] || [],
  }));
};
