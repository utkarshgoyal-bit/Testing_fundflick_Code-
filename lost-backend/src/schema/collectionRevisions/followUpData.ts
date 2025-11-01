import mongoose, { Document, Schema, Types } from 'mongoose';
interface ICaseData extends Document {
  refCaseId: mongoose.Types.ObjectId;
  visitType: 'telecall' | 'visit';
  date: string;
  commit: string;
  remarks: string;
  attitude: 'polite' | 'rude' | 'medium';
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
  organization: mongoose.Types.ObjectId;
}

const FollowUpdataRevisionsSchema: Schema = new Schema(
  {
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: 'organization',
    },
    refCaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'collection_cases_revisions',
      required: true,
    },

    visitType: {
      type: String,
      enum: ['telecall', 'visit'],
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
      enum: ['polite', 'rude', 'medium'],
    },
    selfie: {
      type: String,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'Employeesv2',
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
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employeesv2',
    },
    revisionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the model
const FollowUpDataRevisions = mongoose.model<ICaseData>(
  'collection_case_followup_revisions',
  FollowUpdataRevisionsSchema
);

export default FollowUpDataRevisions;
