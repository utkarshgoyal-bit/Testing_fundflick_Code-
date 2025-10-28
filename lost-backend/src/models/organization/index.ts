import mongoose from "mongoose";
import { ORGANIZATION_STATUS } from "../../shared/enums";
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const organizationSchema = new Schema({
  id: {
    type: Types.String,
    required: true,
    unique: true,
  },
  name: {
    type: Types.String,
    required: true,
    unique: true,
  },
  email: {
    type: Types.String,
    required: true,
  },
  status: {
    type: Types.String,
    enum: ORGANIZATION_STATUS,
    required: true,
  },
  modules: [
    {
      type: Types.String,
      required: true,
    },
  ],
  isActive: {
    type: Types.Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Types.Number,
    required: true,
    default: new Date(),
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
  },
  updatedAt: {
    type: Types.Number,
    required: true,
    default: new Date(),
  },
});
const OrganizationSchema = model("organization", organizationSchema);
export default OrganizationSchema;
