import mongoose, { Document, Schema, Types } from "mongoose";
export interface IData extends Document {
  id?: string;
  loanType?: string;
  caseNo: string;
  customer: string;
  contactNo: string;
  emiAmount: number;
  dueEmiAmount: number;
  dueEmi: number;
  dmaName?: string;
  lastPaymentDetail: string;
  lastPaymentDetailsTimeStamp: number;
  lastPaymentDetailsEndTimeStamp: number;
  commitDate: string;
  caseDate: string;
  caseDateEndTimeStamp: number;
  caseDateTimeStamp: number;
  circleNumber?: string;
  employeeNumber?: string;
  gender: string;
  caste: string;
  fatherName: string;
  address: string;
  area: string;
  repaymentMode: string;
  vehicleNo: string;
  chasisNo: string;
  subCategory: string;
  type: string;
  vehicleMake: string;
  currencySymbol: string;
  vehicleModel: string;
  year: number;
  supplier: string;
  vehicleStatus?: string;
  lastRepossesedOn?: string;
  lastReleasedOn?: string;
  expiryDate: string;
  expiryDateTimeStamp: number;
  expiryDateEndTimeStamp: number;
  ageInDays: number;
  ledgerBalance: number;
  overdue: number;
  status: string;
  dueBounceCharge: number;
  agentName?: string;
  marketingManagerExec: string;
  purposeOfLoan?: string;
  prioritySector?: string;
  financeAmount: number;
  tenure: number;
  receivedEmiCount: number;
  remainingEmiCount: number;
  assignedTo: any;
  followUps: Types.ObjectId[];
  paymentDetails: Types.ObjectId[];
  latitude?: string;
  longitude?: string;
  updatedBy?: any;
  createdAtTimeStamp: number;
  updatedAtTimeStamp: number;
  employeeId?: any;
  organization: any;
  coApplicantsData: {
    name: string;
    ownershipIndicator: number;
  }[];
  revisionId: string;
  expired: boolean;
  remarks: {
    remark: {
      type: StringConstructor;
    };
    createdBy: {
      type: typeof Types.ObjectId;
      ref: string;
    };
  };
}

const DataSchema: Schema = new Schema<IData>(
  {
    id: { type: String, required: false },
    loanType: { type: String, required: true },
    caseNo: { type: String, required: true },
    customer: { type: String, required: false, default: "" },
    contactNo: [{ type: String, required: false, default: "" }],
    emiAmount: { type: Number, required: true, default: 0 },
    dueEmiAmount: { type: Number, required: true, default: 0 },
    dueEmi: { type: Number, required: true, default: 0 },
    dmaName: { type: String, required: false, default: null },

    lastPaymentDetail: { type: String, required: false, default: "" },
    lastPaymentDetailsTimeStamp: { type: Number, required: false, default: 0 },
    lastPaymentDetailsEndTimeStamp: {
      type: Number,
      required: false,
      default: 0,
    },
    caseDate: { type: String, required: false, default: "" },
    caseDateTimeStamp: { type: Number, required: false, default: 0 },
    caseDateEndTimeStamp: { type: Number, required: false, default: 0 },
    circleNumber: { type: String, required: false, default: null },
    employeeNumber: { type: String, required: false, default: null },
    gender: { type: String, required: false, default: "" },
    caste: { type: String, required: false, default: "" },
    fatherName: { type: String, required: false, default: "" },
    address: { type: String, required: false, default: "" },
    area: { type: String, required: true, default: "" },
    repaymentMode: { type: String, required: false, default: "" },
    vehicleNo: { type: String, required: false, default: "" },
    chasisNo: { type: String, required: false, default: "" },
    subCategory: { type: String, required: false, default: "" },
    type: { type: String, required: true, default: "" },
    vehicleMake: { type: String, required: false, default: "" },
    vehicleModel: { type: String, required: false, default: "" },
    year: { type: Number, required: false, default: 0 },
    supplier: { type: String, required: false, default: "" },
    vehicleStatus: { type: String, required: false, default: null },
    lastRepossesedOn: { type: String, required: false, default: null },
    lastReleasedOn: { type: String, required: false, default: null },

    expiryDate: { type: String, required: false, default: "" },
    expiryDateTimeStamp: { type: Number, required: false, default: 0 },
    expiryDateEndTimeStamp: { type: Number, required: false, default: 0 },
    ageInDays: { type: Number, required: false, default: 0 },
    ledgerBalance: { type: Number, required: false, default: 0 },
    overdue: { type: Number, required: false, default: 0 },
    status: { type: String, required: false, default: "" },
    dueBounceCharge: { type: Number, required: false, default: 0 },
    agentName: { type: String, required: false, default: null },
    marketingManagerExec: { type: String, required: false, default: "" },
    purposeOfLoan: { type: String, required: false, default: null },
    prioritySector: { type: String, required: false, default: null },

    financeAmount: { type: Number, required: false, default: 0 },
    tenure: { type: Number, required: false, default: 0 },
    receivedEmiCount: { type: Number, required: false, default: 0 },
    remainingEmiCount: { type: Number, required: false, default: 0 },
    assignedTo: {
      type: Types.ObjectId,
      ref: "Employeesv2",
    },
    followUps: [{ type: Schema.Types.ObjectId, ref: "collection_case_followup" }],
    paymentDetails: [{ type: Schema.Types.ObjectId, ref: "collection_case_payments" }],
    latitude: { type: String, default: null },
    longitude: { type: String, default: null },
    createdAtTimeStamp: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    updatedAtTimeStamp: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    coApplicantsData: {
      type: [
        {
          name: {
            type: String,
          },
          ownershipIndicator: Number,
          latitude: { type: String, default: null },
          longitude: { type: String, default: null },
          contactNo: [{ type: String, default: "" }],
        },
      ],
      default: [],
    },
    remarks: [
      {
        remark: { type: String, required: false },
        createdBy: {
          type: Types.ObjectId,
          ref: "Employeesv2",
        },
      },
    ],
    expired: { type: Boolean, default: false },
    updatedBy: {
      type: Types.ObjectId,
      ref: "Employeesv2",
    },
    currencySymbol: {
      type: String,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employeesv2",
    },
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: "organization",
    },
  },
  { timestamps: true, strict: false }
);

const Data = mongoose.model<IData>("collection_cases", DataSchema);

export default Data;
