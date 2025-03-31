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
