import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;

const employeeSchema = new Schema({
  organization: {
    type: Types.ObjectId,
    required: true,
    ref: "organization",
  },
  firstName: {
    type: Types.String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: Types.String,
    required: [true, "Last Name is required"],
  },
  eId: {
    type: Types.String,
    required: [true, "E-ID is required"],
  },
  email: {
    type: Types.String,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v: string) => isEmail(v),
      message: "Please enter a valid email",
    },
    required: [true, "Email is required"],
  },
  designation: {
    type: Types.String,
  },
  role: {
    type: Types.String,
    enum: ["Temporary", "Seasonal", "Permanent", "Super Admin"],
    required: [true, "Role is required"],
  },
  sex: {
    type: Types.String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Sex is required"],
  },
  dob: {
    type: Types.String,
    required: [true, "Date of Birth is required"],
  },
  maritalStatus: {
    type: Types.String,
    enum: ["Single", "Married"],
  },
  qualification: {
    type: Types.String,
  },
  addressLine1: {
    type: Types.String,
    required: [true, "Address Line 1 is required"],
  },
  addressLine2: {
    type: Types.String,
  },
  country: {
    type: Types.String,
    required: [true, "Country is required"],
  },
  state: {
    type: Types.String,
    required: [true, "State is required"],
  },
  mobile: {
    type: Types.String,
    trim: true,
    required: [true, "Mobile number is required"],
  },
  uid: {
    type: Types.String,
  },
  pan: {
    type: Types.String,
  },
  passport: {
    type: Types.String,
  },
  voterID: {
    type: Types.String,
  },
  drivingLicense: {
    type: Types.String,
  },
  baseSalary: {
    type: Types.String,
  },
  hra: {
    type: Types.String,
  },
  conveyance: {
    type: Types.String,
  },
  incentive: {
    type: Types.String,
  },
  commission: {
    type: Types.String,
  },
  ledger: {
    type: Types.String,
  },
  accountNumber: {
    type: Types.String,
  },
  ifsc: {
    type: Types.String,
  },
  bankName: {
    type: Types.String,
  },
  accountName: {
    type: Types.String,
  },

  isActive: {
    type: Types.Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Types.Date,
    required: true,
    default: Date.now,
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
  },
  updatedAt: {
    type: Types.Date,
    default: Date.now,
  },
  orgName: {
    type: Types.String,
    required: true,
    default: "maitrii",
  },
});
employeeSchema.index({ email: 1, organization: 1 }, { unique: true });
employeeSchema.index({ eId: 1, organization: 1 }, { unique: true });
const EmployeeSchema = model("Employeesv2", employeeSchema);
export default EmployeeSchema;
