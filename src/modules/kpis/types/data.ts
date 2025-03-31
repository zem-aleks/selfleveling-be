import { z } from 'zod';

export const SaveKpiFormSchema = z.object({
  title: z.string().min(1, 'Please enter KPI title'),
  description: z.string().min(1, 'Please enter KPI description'),
  targetValue: z
    .string()
    .min(1, 'Please enter your target value that you would like to achieve'),
  currentValue: z
    .string()
    .min(1, "Please enter your current value from what you're starting"),
  status: z.enum(['draft', 'active']),
});

export type SaveKpiData = z.infer<typeof SaveKpiFormSchema>;
