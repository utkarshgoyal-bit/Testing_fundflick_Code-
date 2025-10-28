import { z } from 'zod';
const branchFormSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  isRoot: z.string().optional().default('true'),
  parentBranch: z.string().optional(),
  landMark: z.string().min(1, 'Land Mark is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal Code is required'),
});

export type BranchFormSchemaType = z.infer<typeof branchFormSchema>;

export { branchFormSchema };
