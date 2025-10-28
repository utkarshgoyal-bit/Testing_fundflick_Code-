import { Types } from "mongoose";
import { User } from "../../interfaces/user.interface";
import TasksSchema from "../../models/tasks";
import { ERROR } from "../../shared/enums";
import { TasksUpdateNotification } from "../../socket/sendNotification";

export default async function acceptTask({ loginUser, taskId }: { loginUser: any; taskId: string }) {
  const acceptedTask = await TasksSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(taskId), organization: loginUser.organization._id },
    {
      acceptedBy: new Types.ObjectId(loginUser.employeeId),
      status: "On Going",
    },
    {
      new: true,
      upsert: false,
    }
  );
  if (!acceptedTask) {
    throw ERROR.INVALID_OPERATION;
  }
  await TasksUpdateNotification({
    users: [
      ...acceptedTask.users.map((user: any) =>
        user instanceof Types.ObjectId || typeof user === "string" ? user : user.userDetails
      ),
      acceptedTask.createdBy,
    ],
    message: {
      taskId: acceptedTask.taskId,
      title: `Task Accepted: ${acceptedTask.taskId} (${acceptedTask.type})`,
      message: [
        acceptedTask.caseNo ? `Case No: ${acceptedTask.caseNo}` : null,
        `${acceptedTask.title} has been accepted.`,
        acceptedTask.description ? `Note: ${acceptedTask.description}` : null,
      ]
        .filter(Boolean)
        .join(", "),
    },
    organization: loginUser.organization._id,
  });

  return acceptedTask;
}
