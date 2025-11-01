import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const rolesSchema = new Schema(
  {
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: 'organization',
    },
    name: {
      type: Types.String,
      required: true,
    },
    permissions: {
      type: [Types.String],
      default: [],
    },
    rolesAccess: {
      type: [Types.ObjectId],
      default: [],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'Employeesv2',
    },
  },
  {
    timestamps: true,
  }
);
rolesSchema.index({ organization: 1, name: 1 }, { unique: true });
const RolesSchema = model('roles', rolesSchema);
export default RolesSchema;
