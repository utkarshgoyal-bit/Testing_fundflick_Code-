import { z } from 'zod';
const LoginFormValidation = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(2, { message: 'Enter a valid password' }),
  os: z.string().optional(),
  device: z.string().optional(),
  location: z.string().optional(),
  browser: z.string().optional(),
  ip: z.string().optional(),
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
  deviceType: z.string().optional(),
  deviceModel: z.string().optional(),
  loggedIn: z.number().optional(),
  updatedAt: z.number().optional(),
});
export type loginFormSchema = z.infer<typeof LoginFormValidation>;
const AddClientFormValidation = z
  .object({
    name: z.string().min(1, { message: 'Client name is required' }),
    mobile: z.string().regex(/^\d{10}$/, { message: 'Mobile must be 10 digits' }),
    clientType: z.string().min(1, { message: 'Client type is required' }),
    email: z.string().email({ message: 'Please enter a valid email' }),
    aadhaar: z.string().optional(),
    pan: z.string().optional(),
    gst: z.string().optional(),
    tan: z
      .string()
      .refine((val) => !val || /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(val), {
        message: 'TAN must be in format AAAA99999A',
      })
      .optional(),
    cin: z
      .string()
      .refine((val) => !val || /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(val), {
        message: 'CIN must be in format L99999DL2000PLC123456',
      })
      .optional(),

    organizationName: z.string().optional(),
    organizationType: z.string().optional(),
    address: z.string().optional(),
    contactPerson: z
      .object({
        name: z.string().optional(),
        mobile: z.string().optional(),
        email: z.string().optional(),
      })
      .optional(),
    directors: z
      .array(
        z.object({
          name: z.string().optional(),
          din: z
            .string()
            .refine((val) => !val || /^\d{8}$/.test(val), {
              message: 'DIN must be 8 digits',
            })
            .optional(),
          aadhaar: z.string().optional(),
        })
      )
      .optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifsc: z.string().optional(),
    branch: z.string().optional(),
    portalName: z.string().optional(),
    portalId: z.string().optional(),
    portalPassword: z.string().optional(),
    files: z.any().optional(),
    services: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    // ✅ Skip all checks for individual clients
    if (data.clientType === 'individual') {
      return;
    }

    // ✅ Business-specific checks
    if (data.clientType === 'business') {
      if (!data.organizationType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Organization type is required for business',
          path: ['organizationType'],
        });
      }
      if (!data.organizationName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Organization name is required for business',
          path: ['organizationName'],
        });
      }

      if (!data.contactPerson?.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Contact person name is required for business',
          path: ['contactPerson.name'],
        });
      }

      if (!data.contactPerson?.mobile || !/^\d{10}$/.test(data.contactPerson.mobile)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Contact mobile is required and must be 10 digits',
          path: ['contactPerson.mobile'],
        });
      }

     

      if (!data.directors || data.directors.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one director is required for business',
          path: ['directors'],
        });
      } else {
        data.directors.forEach((director, index) => {
          if (!director.name) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Director name is required',
              path: [`directors.${index}.name`],
            });
          }
         
        });
      }

      if (['limited', 'private-limited'].includes(data.organizationType || '')) {
      
      }

      // ✅ Aadhaar, PAN, GST check only for business
      if (data.aadhaar && !/^\d{12}$/.test(data.aadhaar)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Aadhaar must be exactly 12 digits',
          path: ['aadhaar'],
        });
      }
      
      

      if (data.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'PAN must be in format AAAAA9999A',
          path: ['pan'],
        });
      }
     
      if (data.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gst)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'GST must be in format 22AAAAA9999A1Z5',
          path: ['gst'],
        });
      }
    }
  });

export type addClientFormSchema = z.infer<typeof AddClientFormValidation>;
export { AddClientFormValidation, LoginFormValidation };
