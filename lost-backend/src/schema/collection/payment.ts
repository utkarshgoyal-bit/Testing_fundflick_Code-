import mongoose, { Document, Schema, Types } from 'mongoose';
interface IPaymentData extends Document {
  refCaseId: mongoose.Types.ObjectId;
  amount: number;
  date: string;
  dateTimeStamp: number;
  dateEndTimeStamp: number;
  paymentMode: 'cash' | 'upi' | 'netbanking' | 'qrcode';
  remarks?: string;
  createdBy: Types.ObjectId;
  createdAtTimeStamp: number;
  updatedAtTimeStamp: number;
  caseNo: string;
  currencySymbol: string;
  os: string;
  employeeId: mongoose.Types.ObjectId;
}

const PaymentDataSchema: Schema = new Schema(
  {
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: 'organization',
    },
    refCaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'collection_cases',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dateTimeStamp: {
      type: Number,
    },
    dateEndTimeStamp: {
      type: Number,
    },
    currencySymbol: {
      type: String,
    },
    paymentMode: {
      type: String,
      required: true,
      enum: ['cash', 'upi', 'netbanking', 'qrcode'],
    },
    remarks: {
      type: String,
      required: false,
    },
    isExtraCharges: {
      type: Boolean,
      required: true,
      default: false,
    },
    extraCharges: {
      type: Number,
      required: false,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'Employeesv2',
      required: true,
    },
    selfie: {
      type: String,
      required: false,
    },
    createdAtTimeStamp: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    updatedAtTimeStamp: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    caseNo: {
      type: String,
      required: true,
    },
    os: {
      type: String,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employeesv2',
    },
  },
  { timestamps: true }
);

const PaymentData = mongoose.model<IPaymentData>('collection_case_payment', PaymentDataSchema);

export default PaymentData;
