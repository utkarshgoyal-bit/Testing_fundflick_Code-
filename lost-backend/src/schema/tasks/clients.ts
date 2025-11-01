import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;

const clientSchema = new Schema({
  name: {
    type: Types.String,
    required: true,
  },
  clientType: {
    type: Types.String,
    enum: ['individual', 'business'],
    required: true,
  },
  email: {
    type: Types.String,
  },
  mobile: {
    type: Types.String,
    required: true,
  },
  aadhaar: {
    type: Types.String,
  },
  pan: {
    type: Types.String,
  },
  gst: {
    type: Types.String,
  },
  tan: {
    type: Types.String,
  },
  cin: {
    type: Types.String,
  },
  address: {
    type: Types.String,
  },
  organizationName: {
    type: Types.String,
    required: false,
  },
  organizationType: {
    type: Types.String,
    enum: ['limited', 'private-limited', 'proprietorship', 'partnership', ''],
    required: false,
  },
  contactPerson: {
    name: {
      type: Types.String,
    },
    mobile: {
      type: Types.String,
    },
    email: {
      type: Types.String,
    },
  },
  directors: [
    {
      name: {
        type: Types.String,
      },
      din: {
        type: Types.String,
      },
      aadhaar: {
        type: Types.String,
      },
    },
  ],
  bankName: {
    type: Types.String,
  },
  accountNumber: {
    type: Types.String,
  },
  ifsc: {
    type: Types.String,
  },
  branch: {
    type: Types.String,
  },
  portalName: {
    type: Types.String,
  },
  portalId: {
    type: Types.String,
  },
  portalPassword: {
    type: Types.String,
  },
  services: [
    {
      type: Types.ObjectId,
      ref: 'services',
      required: true,
    },
  ],
  documentUrl: {
    type: Types.String,
  },
  isDeleted: {
    type: Types.Boolean,
    default: false,
    required: true,
  },
  organizationId: {
    type: Types.ObjectId,
    required: true,
    ref: 'organization',
  },
  createdAt: {
    type: Types.Number,
    default: Date.now,
    required: true,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: 'Employeesv2',
    default: null,
  },
  updatedAt: {
    type: Types.Number,
    default: Date.now,
    required: true,
  },
  updatedBy: {
    type: Types.ObjectId,
    default: null,
  },
  MONGO_DELETED: { type: Types.Boolean, default: false },
});
clientSchema.index({ name: 1, organizationId: 1 }, { unique: true });
const ClientSchema = model('clientsv2', clientSchema);
export default ClientSchema;
