import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const pendencySchema = new Schema({
  organization: {
    type: Types.ObjectId,
    required: true,
    ref: 'organization',
  },
  employeeId: {
    type: Types.ObjectId,
    ref: 'Employeesv2',
    required: true,
  },
  isDeleted: {
    type: Types.Boolean,
    required: true,
    default: false,
  },
  title: {
    type: Types.String,
    required: true,
  },
  description: {
    type: Types.String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    required: true,
  },
  fileId: {
    type: Types.Number,
  },
  createdAt: {
    type: Types.Date,
    required: true,
    default: new Date(),
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'Employeesv2',
  },
  updatedAt: {
    type: Types.Date,
    required: true,
    default: new Date(),
  },
  updatedBy: {
    type: Types.ObjectId,
    required: true,
  },
  orgName: {
    type: Types.String,
    required: true,
    default: 'maitrii',
  },
});

pendencySchema.index({ organization: 1, employeeId: 1, title: 1 }, { unique: true });

const PendencySchema = model('pendencyv2', pendencySchema);
export default PendencySchema;
