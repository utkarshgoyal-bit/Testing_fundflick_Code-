import { REPEAT_STATUS } from '@/lib/enums/task';
import { z } from 'zod';

export const FormSchema = z
  .object({
    type: z.enum(['payment', 'pendency', 'approvals', 'other', 'CA'], {
      required_error: 'Task type is required',
    }),
    priorityOfTask: z
      .string({
        required_error: 'Priority is required',
        invalid_type_error: 'Priority is required',
      })
      .transform(Number),
    caseNo: z.string().optional(),
    serviceId: z.string().optional(),
    returnName: z.string().optional(),
    clientId: z.string().optional(),
    title: z.string().optional(),
    paymentType: z.enum(['first', 'part', 'final']).optional(),
    amount: z.string().transform(Number).optional(),
    description: z.string().optional(),
    approvalBased: z.boolean().default(false),
    users: z.array(z.object({ name: z.string(), employeeId: z.string() })).min(1, { message: 'User name is required' }),
    cc: z.array(z.object({ name: z.string(), employeeId: z.string() })).optional(),
    repeat: z
      .enum([
        REPEAT_STATUS.MONTHLY,
        REPEAT_STATUS.WEEKLY,
        REPEAT_STATUS.YEARLY,
        REPEAT_STATUS.QUARTERLY,
        REPEAT_STATUS.NO_REPEAT,
      ])
      .default(REPEAT_STATUS.NO_REPEAT),
    startDate: z.number().optional(),
    dueAfterDays: z.union([z.number(), z.string()]).refine(
      (val) => {
        if (typeof val === 'string' && val.length > 0) {
          const num = Number(val);
          return !isNaN(num) && num >= 0;
        }
        return val.toString().trim() !== '' && +val >= 0;
      },
      {
        message: 'Due after days must be a non-negative number',
      }
    ),
    weeklyDay: z.string().optional(),
    monthlyDay: z.string().optional(),
    yearlyMonth: z.string().optional(),
    yearlyDay: z.string().optional(),
  })
  .refine((data) => data.repeat !== REPEAT_STATUS.NO_REPEAT || !!data.startDate, {
    message: 'Start date is required',
    path: ['startDate'],
  })
  .refine(
    (data) => {
      if (data.repeat === 'weekly') return data.weeklyDay && data.weeklyDay.length > 0;
      return true;
    },
    {
      message: 'Please select at least one day for weekly repeat',
      path: ['weeklyDay'],
    }
  )
  .refine((data) => data.repeat !== REPEAT_STATUS.MONTHLY || !!data.monthlyDay, {
    message: 'Monthly day is required',
    path: ['monthlyDay'],
  })
  .refine((data) => data.repeat !== REPEAT_STATUS.YEARLY || !!data.yearlyMonth, {
    message: 'Yearly month is required',
    path: ['yearlyMonth'],
  })
  .refine((data) => data.repeat !== REPEAT_STATUS.YEARLY || !!data.yearlyDay, {
    message: 'Yearly day is required',
    path: ['yearlyDay'],
  })
  .refine(
    (data) => {
      if (data.type === 'payment' && !data.paymentType) return false;
      return true;
    },
    {
      message: 'Payment type is required',
      path: ['paymentType'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'pendency' && !data.caseNo) return false;
      return true;
    },
    {
      message: 'File is required',
      path: ['caseNo'],
    }
  )
  .refine(
    (data) => {
      if (data.type == 'other' && !data.title?.length) return false;
      return true;
    },
    {
      message: 'Title is required',
      path: ['title'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'payment' && !data.amount) return false;
      return true;
    },
    {
      message: 'Amount is required',
      path: ['amount'],
    }
  );
export type ITaskFormType = z.infer<typeof FormSchema>;
