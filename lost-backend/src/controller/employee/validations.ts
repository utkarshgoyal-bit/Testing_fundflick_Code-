import { Types } from 'mongoose';
import { z } from 'zod';
import isEmail from 'validator/lib/isEmail';

const addEmployeeReqValidation = z.object({
    firstName: z.string().nonempty("First Name is required"),
    lastName: z.string().nonempty("Last Name is required"),
    eId: z.string().nonempty("E-ID is required"),
    email: z.string().refine((value) => isEmail(value), {
        message: "Please enter a valid email",
    }),
    designation: z.string().optional(),
    role: z.enum(["Temporary", "Seasonal", "Permanent"], {
        required_error: "Status is required",
    }),
    sex: z.enum(["Male", "Female", "Other"], {
        required_error: "Sex is required",
    }),
    dob: z.string().nonempty("Date of Birth is required"),
    maritalStatus: z.enum(["Single", "Married"]).optional(),
    qualification: z.string().optional(),
    addressLine1: z.string().nonempty("Address Line 1 is required"),
    addressLine2: z.string().optional(),
    country: z.string().nonempty("Country is required"),
    state: z.string().nonempty("State is required"),
    mobile: z.string().nonempty("Mobile number is required"),
    uid: z.string().optional(),
    pan: z.string().optional(),
    passport: z.string().optional(),
    voterID: z.string().optional(),
    drivingLicense: z.string().optional(),
    baseSalary: z.string().optional(),
    hra: z.string().optional(),
    conveyance: z.string().optional(),
    incentive: z.string().optional(),
    commission: z.string().optional(),
    ledger: z.string().optional(),
    accountNumber: z.string().optional(),
    ifsc: z.string().optional(),
    accountName: z.string().optional(),
    bankName: z.string().optional(),
    isActive: z.boolean().default(true),
    createdAt: z.string().default(Date.now().toString()),
    createdBy: z.any().refine((value) => Types.ObjectId.isValid(value), {
        message: '${value} is not a valid ObjectId',
    }).optional(),
    updatedAt: z.string().default(Date.now().toString()),
    orgName: z.string().default("maitrii"),
});

export type AddEmployeeReqType = z.infer<typeof addEmployeeReqValidation>;
export default addEmployeeReqValidation;
