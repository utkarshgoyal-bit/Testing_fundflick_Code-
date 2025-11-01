import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const servicesSchema = new Schema({
  serviceName: {
    type: Types.String,
    required: true,
  },
  departmentId: {
    type: Types.ObjectId,
    required: true,
    ref: 'departments',
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
  isDeleted: {
    type: Types.Boolean,
    required: true,
    default: false,
  },
  MONGO_DELETED: { type: Types.Boolean, default: false },
});
servicesSchema.index({ serviceName: 1, organizationId: 1 }, { unique: true });
const ServicesSchema = model('services', servicesSchema);
export default ServicesSchema;
