// types.ts
import { z } from 'zod';
import { COLLECTION_ROUTES } from '@/lib/enums';
import moment from 'moment';

export const recordSchema = z.object({
  loanType: z.string().optional().nullable(),
  caseNo: z.string(),
  customer: z.string().optional().nullable(),
  contactNo: z.array(z.string()).optional().nullable(),
  emiAmt: z.string().optional().nullable(),
  dueEmiAmt: z.string().optional().nullable(),
  dueEmi: z.string().optional().nullable(),
  lastPaymentDetail: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  area: z.string().optional().nullable(),
  financeAmount: z.string().optional().nullable(),
  tenure: z.string().optional().nullable(),
  caseDate: z.string().optional().nullable(),
});

export const recordArraySchema = z.array(recordSchema);

export type RecordData = z.infer<typeof recordSchema>;

export type CollectionType = `${COLLECTION_ROUTES.COLLECTION}` | `${COLLECTION_ROUTES.FOLLOWUP}`;

export const formSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  extraCharges: z.number().nonnegative('Extra Charges must be nonnegative').default(0),
  isExtraCharges: z.boolean().default(false),
  selfie: z.any().optional(),
  date: z.string().refine((date) => {
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    return date >= yesterday && date <= today;
  }, 'Date must be between yesterday and today'),
  paymentMode: z.enum(['cash', 'upi', 'netbanking', 'qrcode'], {
    errorMap: () => ({ message: 'Payment mode is required' }),
  }),
  remarks: z.string().optional(),
});

export type FormInputs = z.infer<typeof formSchema>;

export const formSchemaFollowUp = z
  .object({
    visitType: z.enum(['telecall', 'visit'], {
      required_error: 'Visit Type is required',
      invalid_type_error: 'Visit Type is required',
    }),
    noReply: z.boolean().optional(),
    selfie: z.any().optional(),
    date: z.string().nonempty('Date is required'),
    commit: z.string().optional(),
    remarks: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    // Allow attitude to be null or undefined
    attitude: z.enum(['polite', 'rude', 'medium']).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    // If noReply is false (or not checked), then both commit and attitude must have valid values.
    if (!data.noReply) {
      if (!data.commit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'P2P Date is required unless No reply is checked',
          path: ['commit'],
        });
      }
      if (!data.attitude) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Attitude is required unless No reply is checked',
          path: ['attitude'],
        });
      }
      if (!data.remarks) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Remarks is required unless No reply is checked',
          path: ['remarks'],
        });
      }
    }
  });

export type FormFollowupInputs = z.infer<typeof formSchemaFollowUp>;
