import { Types } from "mongoose";
import { User } from "../../interfaces/user.interface";
import TasksSchema from "../../models/tasks";
import { ERROR } from "../../shared/enums";
import { TasksUpdateNotification } from "../../socket/sendNotification";

export default async function stopRepeat({ loginUser, body }: { loginUser: any; body: any }) {
  const { taskId } = body;
  const updatedTask = await TasksSchema.findOneAndUpdate(
    {
      taskId: taskId,
      createdBy: new Types.ObjectId(loginUser.employeeId),
      organization: loginUser.organization._id,
    },
    {
      repeat: "noRepeat",
      updatedAt: new Date(),
      updatedBy: new Types.ObjectId(loginUser.employeeId),
    },
    {
      new: true,
    }
  );
  if (!updatedTask) {
    throw ERROR.NOT_FOUND;
  }
  await TasksUpdateNotification({
    users: [
      ...updatedTask.users.map((user: any) =>
        user instanceof Types.ObjectId || typeof user === "string" ? user : user.userDetails
      ),
      updatedTask.createdBy,
    ],
    message: {
      taskId: updatedTask.taskId,
      title: `Repeat Stopped: ${updatedTask.taskId} (${updatedTask.type})`,
      message: [
        updatedTask.caseNo ? `Case No: ${updatedTask.caseNo}` : null,
        `${updatedTask.title} is no longer set to repeat.`,
        updatedTask.description ? `Note: ${updatedTask.description}` : null,
      ]
        .filter(Boolean)
        .join(", "),
    },
    organization: loginUser.organization._id,
  });

  return updatedTask;
}
