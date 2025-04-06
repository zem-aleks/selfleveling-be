import { KpiEntity, KpiWithMeasurementsEntity } from '../types/entity';
import { Kpi } from '../entities/kpi.entity';
import { Measurement } from '../entities/measurement.entity';
import dayjs from 'dayjs';

export const mapKpiToEntity = (kpi: Kpi): KpiEntity => {
  return kpi;
};

export const mapKpiToEntityWithMeasurements = (
  kpi: Kpi,
  measurements: Measurement[],
): KpiWithMeasurementsEntity => {
  const sorted = measurements.sort((a, b) =>
    dayjs(a.createdAt).diff(dayjs(b.createdAt)),
  );
  return {
    ...kpi,
    measurements,
    currentValue: sorted[sorted.length - 1]?.value || 'No info',
    startingValue: sorted[0]?.value || 'No info',
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

  return kpis.map((kpi) =>
    mapKpiToEntityWithMeasurements(kpi, measurementsMap[kpi.id] || []),
  );
};
