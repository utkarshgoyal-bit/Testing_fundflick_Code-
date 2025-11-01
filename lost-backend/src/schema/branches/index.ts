import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const branchSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  children: [
    {
      type: Types.ObjectId,
      ref: 'Branchesv2',
    },
  ],
  parentBranch: {
    type: Types.ObjectId,
    ref: 'Branchesv2',
  },
  isRoot: {
    type: Boolean,
    required: true,
    default: false,
  },
  landMark: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'Employeesv2',
  },
  updatedAt: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  IS_DELETED: {
    type: Boolean,
    required: false,
    default: false,
  },
  organization: {
    type: Types.ObjectId,
    required: true,
    ref: 'organization',
  },
});
branchSchema.index({ name: 1, organization: 1 }, { unique: true });
const BranchModel = model('Branchesv2', branchSchema);
export default BranchModel;
