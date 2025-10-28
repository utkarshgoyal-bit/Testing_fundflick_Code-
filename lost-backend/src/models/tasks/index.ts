import mongoose from "mongoose";
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const tasksSchema = new Schema({
  organization: {
    type: Types.ObjectId,
    required: true,
    ref: "organization",
  },
  type: {
    type: Types.String,
  },
  caseNo: {
    type: Types.String,
  },
  users: [
    {
      name: {
        type: Types.String,
        required: true,
      },
      userDetails: {
        type: Types.ObjectId,
        ref: "Employeesv2",
        required: true,
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
    type: Types.Number,
    required: true,
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
    type: Types.Date,
    default: new Date().toISOString(),
  },
  dueAfterDays: {
    type: Types.Number,
  },
  acceptedBy: {
    type: Types.ObjectId,
    ref: "Employeesv2",
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
        ref: "Employeesv2",
      },
    },
  ],
  createdAt: {
    type: Types.Date,
    required: true,
    default: new Date(),
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: "Employeesv2",
    default: null,
  },
  updatedAt: {
    type: Types.Date,
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
    default: "maitrii",
  },
});
const TasksSchema = model("tasksv2", tasksSchema);
export default TasksSchema;
