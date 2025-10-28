import { model, Schema, Types } from "mongoose";

const Notification = new Schema(
  {
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: "organization",
    },
    employeeId: {
      type: Types.ObjectId,
      required: true,
      ref: "Employeesv2",
    },
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    taskId: {
      type: Number,
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
    file: {
      type: Types.ObjectId,
      ref: "CustomerFilesv2",
    },
    loanApplicationNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

const NotificationModel = model("Notification", Notification);
export default NotificationModel;
