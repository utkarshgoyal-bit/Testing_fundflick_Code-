import mongoose, { Schema } from 'mongoose';

const organizationConfigsSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sk: {
      type: String,
      required: true,
    },
    env: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
    },
    updatedAt: {
      type: Number,
      default: Date.now,
    },
    createdAt: {
      type: Number,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

organizationConfigsSchema.index({ organizationId: 1, category: 1, sk: 1 }, { unique: true });
const OrganizationConfigs = mongoose.model('organizationConfigs', organizationConfigsSchema);
export default OrganizationConfigs;
