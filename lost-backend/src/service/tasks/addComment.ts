import { Types } from "mongoose";
import { User } from "../../interfaces/user.interface";
import TasksSchema from "../../models/tasks";
import { ERROR } from "../../shared/enums";
import { TasksUpdateNotification } from "../../socket/sendNotification";

export default async function addComments({ body, loginUser }: { body: any; loginUser: any }) {
  const { _id, ...payload } = body;
  const updatedTask = await TasksSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(_id), organization: loginUser.organization._id },
    {
      updatedBy: new Types.ObjectId(loginUser.employeeId),
      $push: {
        comments: {
          ...payload,
          createdAt: Date.now(),
          createdBy: new Types.ObjectId(loginUser.employeeId),
        },
      },
    },
    {
      new: true,
      upsert: false,
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
      title: `New Comment: ${updatedTask.taskId} (${updatedTask.type})`,
      message: [
        updatedTask.caseNo ? `Case No: ${updatedTask.caseNo}` : null,
        `Comment on: ${updatedTask.title}`,
        payload.comment ? `Comment: ${payload.comment}` : null,
      ]
        .filter(Boolean)
        .join(", "),
    },
    organization: loginUser.organization._id,
  });

  return updatedTask;
}
