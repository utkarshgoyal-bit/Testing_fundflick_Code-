import { Types } from "mongoose";
import TasksSchema from "../../models/tasks";
import { ROLES } from "../../shared/enums";

export default async function getTasks({
  loginUser,
  active,
  activeFilter,
}: {
  loginUser: any;
  active: boolean;
  activeFilter: string;
}) {
  let query: {} = {};
  if (activeFilter == "all") {
    if (loginUser.role !== ROLES.SUPERADMIN) {
      query = {
        $or: [
          { createdBy: new Types.ObjectId(loginUser.employeeId) },
          { "users.userDetails": new Types.ObjectId(loginUser.employeeId) },
        ],
      };
    }
  } else if (activeFilter == "assignedToMe") {
    query = {
      "users.userDetails": new Types.ObjectId(loginUser.employeeId),
    };
  } else if (activeFilter == "assignedByMe") {
    query = {
      createdBy: new Types.ObjectId(loginUser.employeeId),
    };
  }
  const tasksData = await TasksSchema.find({
    ...query,
    organization: loginUser.organization._id,
    isDeleted: false,
    status: active ? { $ne: "Completed" } : { $in: ["Completed", "Expired"] },
  })
    .sort({ createdAt: -1 })
    .populate("createdBy", ["firstName", "middleName", "lastName"])
    .populate("comments.createdBy", ["firstName", "middleName", "lastName"])
    .select({
      _id: 1,
      type: 1,
      caseNo: 1,
      users: 1,
      paymentType: 1,
      title: 1,
      description: 1,
      repeat: 1,
      taskId: 1,
      startDate: 1,
      dueAfterDays: 1,
      acceptedBy: 1,
      comments: 1,
      createdAt: 1,
      createdBy: 1,
      isDeleted: 1,
      status: 1,
      updatedAt: 1,
      amount: 1,
    });

  return tasksData;
}
