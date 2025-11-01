import { Types } from 'mongoose';
import { z } from 'zod';

export const addBranchReqValidation = z.object({
  name: z.string(),
  landMark: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  postalCode: z.string(),
  isRoot: z.boolean().default(true),
  parentBranch: z
    .string()
    .optional()
    .refine(value => value === undefined || Types.ObjectId.isValid(value), {
      message: '${value} is not a valid ObjectId',
    }),
});
export type AddBranchReqType = z.infer<typeof addBranchReqValidation>;

export const editBranchReqValidation = z.object({
  id: z.string(),
  name: z.string(),
  landMark: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  isRoot: z.boolean().default(true),
  postalCode: z.string(),
  parentBranch: z
    .string()
    .optional()
    .refine(value => value === undefined || Types.ObjectId.isValid(value), {
      message: '${value} is not a valid ObjectId',
    }),
});
export type EditBranchReqType = z.infer<typeof editBranchReqValidation>;
