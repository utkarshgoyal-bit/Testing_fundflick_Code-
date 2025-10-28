import mongoose, { Document, Schema, Types } from "mongoose";
interface ICaseData extends Document {
  refCaseId: mongoose.Types.ObjectId;
  visitType: "telecall" | "visit";
  date: string;
  commit: string;
  remarks: string;
  attitude: "polite" | "rude" | "medium";
  createdBy: any;
  selfie: string;
  noReply: boolean;
  role: string;
  dateTimeStamp: number;
  dateEndTimeStamp: number;
  commitTimeStamp: number;
  commitEndTimeStamp: number;
  caseNo: string;
  userId: mongoose.Types.ObjectId;
  os: string;
  currencySymbol: string;
  employeeId: mongoose.Types.ObjectId;
}

const FollowUpdataSchema: Schema = new Schema(
  {
    refCaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "collection_cases",
      required: true,
    },

    visitType: {
      type: String,
      enum: ["telecall", "visit"],
      required: true,
    },
    latitude: { type: String, default: null },
    longitude: { type: String, default: null },
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
    commit: {
      type: Date,
      required: false,
      default: null,
    },
    commitTimeStamp: {
      type: Number,
      required: false,
      default: null,
    },
    commitEndTimeStamp: {
      type: Number,
      required: false,
      default: null,
    },
    remarks: {
      type: String,
    },
    attitude: {
      type: String,
      enum: ["polite", "rude", "medium"],
    },
    selfie: {
      type: String,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "Employeesv2",
      required: true,
    },
    noReply: {
      type: Boolean,
      default: false,
    },
    caseNo: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    createdAtTimeStamp: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    updatedAtTimeStamp: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    os: {
      type: String,
    },
    currencySymbol: {
      type: String,
    },
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: "organization",
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employeesv2",
    },
  },
  { timestamps: true }
);

// Create and export the model
const FollowUpData = mongoose.model<ICaseData>("collection_case_followup", FollowUpdataSchema);

export default FollowUpData;
