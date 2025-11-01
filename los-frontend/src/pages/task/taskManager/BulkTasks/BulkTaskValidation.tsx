import { z } from 'zod';

export const bulkTaskSchema = z
  .object({
    departmentId: z.string().min(1, 'Department is required'),
    serviceId: z.string().min(1, 'Service is required'),
    users: z
      .array(
        z.object({
          name: z.string(),
          employeeId: z.string(),
        })
      )
      .min(1, 'At least one user must be assigned'),
    description: z.string().min(1, 'Description is required'),
    repeat: z.enum(['no_repeat', 'weekly', 'monthly', 'quarterly', 'yearly']),
    weeklyDay: z.string().optional(),
    monthlyDay: z.string().optional(),
    yearlyMonth: z.string().optional(),
    yearlyDay: z.string().optional(),
    startDate: z.union([z.string(), z.number()]).optional(),
    dueAfterDays: z.string().optional(),
    priorityOfTask: z.string().optional(),
    cc: z
      .array(
        z.object({
          name: z.string(),
          employeeId: z.string(),
        })
      )
      .optional(),
    approvalBased: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.repeat === 'weekly' && !data.weeklyDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weekly day is required for weekly repeat',
        path: ['weeklyDay'],
      });
    }
    if (data.repeat === 'monthly' && !data.monthlyDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Monthly day is required for monthly repeat',
        path: ['monthlyDay'],
      });
    }
    if (data.repeat === 'yearly' && (!data.yearlyMonth || !data.yearlyDay)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Yearly month and day are required for yearly repeat',
        path: ['yearlyMonth'],
      });
    }
    if (data.repeat === 'no_repeat' && !data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date is required for no repeat',
        path: ['startDate'],
      });
    }
  });
