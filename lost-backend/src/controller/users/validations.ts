import { Types } from "mongoose";
import { z } from "zod";

const addUserReqValidation = z.object({
  employeeId: z.string(),
  branches: z.array(z.string()),
  roleRef: z.any().refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid role",
  }),
  isActive: z.boolean().default(true),
  createdAt: z.string().default(Date.now().toString()),
  createdBy: z
    .any()
    .refine((value) => Types.ObjectId.isValid(value), {
      message: "${value} is not a valid ObjectId",
    })
    .optional(),
});
export type AddUserReqType = z.infer<typeof addUserReqValidation>;
export default addUserReqValidation;
