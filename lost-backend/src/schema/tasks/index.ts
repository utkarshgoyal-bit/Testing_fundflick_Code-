import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const tasksSchema = new Schema({
  organizationId: {
    type: Types.ObjectId,
    required: true,
    ref: 'organization',
  },
  type: {
    type: Types.String,
  },
  priorityOfTask: {
    type: Types.Number,
  },
  caseNo: {
    type: Types.String,
  },

  serviceId: {
    type: Types.ObjectId,
    ref: 'services',
  },
  returnName: {
    type: Types.String,
  },
  clientId: {
    type: Types.ObjectId,
    ref: 'clientsv2',
  },
  departmentId: {
    type: Types.ObjectId,
    ref: 'departments',
  },
  users: [
    {
      name: {
        type: Types.String,
        required: true,
      },
      employeeId: {
        type: Types.ObjectId,
        ref: 'Employeesv2',
        required: true,
      },
    },
  ],
  approvalBased: {
    type: Types.Boolean,
    default: false,
  },
  cc: [
    {
      name: {
        type: Types.String,
      },
      employeeId: {
        type: Types.ObjectId,
        ref: 'Employeesv2',
      },
    },
  ],
  paymentType: {
    type: Types.String,
  },
  amount: {
    type: Types.Number,
  },
  title: {
    type: Types.String,
  },
  description: {
    type: Types.String,
  },
  repeat: {
    type: Types.String,
    required: true,
    default: false,
  },
  taskId: {
    type: Types.String,
    required: true,
    unique: true,
  },
  isDeleted: {
    type: Types.Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    required: true,
  },
  startDate: {
    type: Types.Number,
    default: new Date(),
  },
  dueAfterDays: {
    type: Types.Number,
  },
  weeklyDay: {
    type: Types.String,
  },
  monthlyDay: {
    type: Types.Number,
  },
  yearlyDay: {
    type: Types.Number,
  },
  yearlyMonth: {
    type: Types.Number,
  },
  acceptedBy: {
    type: Types.ObjectId,
    ref: 'Employeesv2',
  },
  comments: [
    {
      comment: { type: Types.String, required: true },
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
  createdAt: {
    type: Types.Number,
    required: true,
    default: new Date(),
  },
  isPinned: {
    type: Types.Boolean,
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
    default: null,
  },
  timeline: [
    {
      comment: { type: Types.String, required: true },
      createdAt: {
        type: Types.Number,
        required: true,
        default: new Date().getTime(),
      },
      createdBy: {
        type: Types.ObjectId,
        required: true,
        ref: 'Employeesv2',
      },
      createdByName: {
        type: Types.String,
        required: false,
        default: null,
      },
    },
  ],
  isBulkTask: {
    type: Types.Boolean,
    required: false,
    default: false,
  },
  refTaskId: {
    type: Types.String,
    required: false,
    default: null,
  },
  MONGO_DELETED: { type: Types.Boolean, default: false },
});
tasksSchema.index({ taskId: 1, organizationId: 1 }, { unique: true });
const TasksSchema = model('tasksv2', tasksSchema);
export default TasksSchema;
