import { KpiEntity } from '../types/entity';
import { Kpi } from '../entities/kpi.entity';

export const mapKpiToEntity = (kpi: Kpi): KpiEntity => {
  return kpi;
};
