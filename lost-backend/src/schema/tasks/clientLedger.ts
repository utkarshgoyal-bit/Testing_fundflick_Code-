import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const clientLedgerSchema = new Schema({
  title: {
    type: Types.String,
    required: true,
  },
  serviceId: {
    type: Types.ObjectId,
    ref: 'services',
  },
  clientId: {
    type: Types.ObjectId,
    ref: 'clientsv2',
  },
  paymentStatus: {
    type: Types.String,
    default: 'Pending',
    enum: ['Pending', 'Invoice Sent', 'Received'],
  },
  timeline: [
    {
      title: {
        type: Types.String,
        required: true,
      },
      date: {
        type: Types.Number,
        required: true,
        default: Date.now(),
      },
      remark: {
        type: Types.String,
        default: '',
      },
      amountReceived: {
        type: Types.Number,
        default: 0,
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
      },
    },
  ],
  dateOfCompletion: {
    type: Types.Number,
    required: true,
  },
  completedBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'Employeesv2',
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
const ClientLedgerSchema = model('clientLedger', clientLedgerSchema);
export default ClientLedgerSchema;
