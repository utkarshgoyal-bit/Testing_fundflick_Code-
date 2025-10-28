import { Types } from "mongoose";
import TasksSchema from "../../models/tasks";
import { ERROR } from "../../shared/enums";
import { TasksUpdateNotification } from "../../socket/sendNotification";

export default async function deleteTask({ loginUser, body }: { loginUser: any; body: any }) {
  const { _id } = body;
  const deletedTask = await TasksSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(_id),
      createdBy: new Types.ObjectId(loginUser.employeeId),
      organization: loginUser.organization._id,
    },
    {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: new Types.ObjectId(loginUser.employeeId),
    },
    {
      new: true,
      upsert: false,
    }
  );
  if (!deletedTask) {
    throw ERROR.INVALID_OPERATION;
  }
  await TasksUpdateNotification({
    users: [
      ...deletedTask.users.map((user: any) =>
        user instanceof Types.ObjectId || typeof user === "string" ? user : user.userDetails
      ),
      deletedTask.createdBy,
    ],
    message: {
      taskId: deletedTask.taskId,
      title: `Task Deleted: ${deletedTask.taskId} (${deletedTask.type})`,
      message: [
        deletedTask.caseNo ? `Case No: ${deletedTask.caseNo}` : null,
        `${deletedTask.title} has been deleted.`,
        deletedTask.description ? `Note: ${deletedTask.description}` : null,
      ]
        .filter(Boolean)
        .join(", "),
    },
    organization: loginUser.organization._id,
  });

  return deletedTask;
}
