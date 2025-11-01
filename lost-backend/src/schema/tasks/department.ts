import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const departmentSchema = new Schema({
  departmentName: {
    type: Types.String,
    required: true,
  },
  description: {
    type: Types.String,
  },
  organizationId: {
    type: Types.ObjectId,
    required: true,
    ref: 'organization',
  },
  createdAt: {
    type: Types.Number,
    required: true,
    default: new Date(),
  },
  isDeleted: {
    type: Types.Boolean,
    required: true,
    default: false,
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'Employeesv2',
    default: null,
  },
  updatedAt: {
    type: Types.Number,
    required: true,
    default: new Date(),
  },
  updatedBy: {
    type: Types.ObjectId,
    required: true,
    default: null,
  },
  orgName: {
    type: Types.String,
    required: true,
  },
  MONGO_DELETED: { type: Types.Boolean, default: false },
});
departmentSchema.index({ departmentName: 1, organizationId: 1 }, { unique: true });
const DepartmentSchema = model('departments', departmentSchema);
export default DepartmentSchema;
