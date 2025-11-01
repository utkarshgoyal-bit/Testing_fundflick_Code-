import mongoose, { Document, Schema, Types } from 'mongoose';
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
  organization: {
    type: typeof Types.ObjectId;
    ref: string;
  };
}

const CollectionRevisionsSchema: Schema = new Schema<IData>(
  {
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: 'organization',
    },
    id: { type: String, default: '' },
    loanType: { type: String, default: '' },
    caseNo: { type: String, required: true, default: '' },
    customer: { type: String, default: '' },

    contactNo: [{ type: String, default: '' }],
    emiAmount: { type: Number, required: false, default: 0 },
    dueEmiAmount: { type: Number, required: false, default: 0 },
    dueEmi: { type: Number, required: false, default: 0 },
    dmaName: { type: String, default: '' },
    lastPaymentDetail: { type: String, default: '' },

    lastPaymentDetailsTimeStamp: { type: Number, required: false, default: 0 },
    lastPaymentDetailsEndTimeStamp: {
      type: Number,
      required: false,
      default: 0,
    },

    caseDate: { type: String, default: '' },
    caseDateTimeStamp: { type: Number, required: false, default: 0 },
    caseDateEndTimeStamp: { type: Number, required: false, default: 0 },
    circleNumber: { type: String, default: '' },
    employeeNumber: { type: String, default: '' },
    gender: { type: String, default: '' },
    caste: { type: String, default: '' },
    fatherName: { type: String, default: '' },
    address: { type: String, default: '' },
    area: { type: String, default: '' },
    repaymentMode: { type: String, default: '' },

    vehicleNo: { type: String, default: '' },
    chasisNo: { type: String, default: '' },
    subCategory: { type: String, default: '' },
    type: { type: String, default: '' },
    vehicleMake: { type: String, default: '' },
    vehicleModel: { type: String, default: '' },
    year: { type: Number, default: 0 },
    supplier: { type: String, default: '' },
    vehicleStatus: { type: String, default: '' },
    lastRepossesedOn: { type: String, default: '' },
    lastReleasedOn: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
    expiryDateTimeStamp: { type: Number, default: 0 },
    expiryDateEndTimeStamp: { type: Number, default: 0 },
    ageInDays: { type: Number, default: 0 },
    ledgerBalance: { type: Number, default: 0 },
    overdue: { type: Number, default: 0 },
    status: { type: String, default: '' },
    dueBounceCharge: { type: Number, default: 0 },
    agentName: { type: String, default: '' },
    marketingManagerExec: { type: String, default: '' },
    purposeOfLoan: { type: String, default: '' },
    prioritySector: { type: String, default: '' },
    financeAmount: { type: Number, required: false, default: 0 },
    tenure: { type: Number, required: false, default: 0 },
    receivedEmiCount: { type: Number, required: false, default: 0 },
    remainingEmiCount: { type: Number, required: false, default: 0 },
    assignedTo: {
      type: Types.ObjectId,
      ref: 'Employeesv2',
      default: null,
    },
    followUps: [{ type: Schema.Types.ObjectId, ref: 'collection_case_followup', default: [] }],
    paymentDetails: [{ type: Schema.Types.ObjectId, ref: 'collection_case_payments', default: [] }],
    latitude: { type: String, default: '' },
    longitude: { type: String, default: '' },
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
          name: { type: String, default: '' },
          ownershipIndicator: { type: Number, default: 0 },
          latitude: { type: String, default: '' },
          longitude: { type: String, default: '' },
          contactNo: [{ type: String, default: '' }],
        },
      ],
      default: [],
    },
    remarks: [
      {
        remark: { type: String, default: '' },
        createdBy: {
          type: Types.ObjectId,
          ref: 'Employeesv2',
          default: null,
        },
      },
    ],
    expired: { type: Boolean, default: false },
    updatedBy: {
      type: Types.ObjectId,
      ref: 'Employeesv2',
      default: null,
    },
    currencySymbol: {
      type: String,
      default: '',
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employeesv2',
      default: null,
    },
    revisionId: {
      type: String,
      required: true,
      default: '',
    },
  },
  { timestamps: false, strict: false }
);

const CollectionRevisions = mongoose.model<IData>(
  'collection_case_revisions',
  CollectionRevisionsSchema
);

export default CollectionRevisions;
