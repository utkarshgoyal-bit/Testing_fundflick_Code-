import { Types } from "mongoose";
import { User } from "../../interfaces/user.interface";
import TasksSchema from "../../models/tasks";
import { ERROR } from "../../shared/enums";
import { TasksUpdateNotification } from "../../socket/sendNotification";

export default async function markAsDone({ loginUser, body }: { loginUser: any; body: any }) {
  const { _id } = body;
  const updatedTask = await TasksSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(_id),
      organization: loginUser.organization._id,
    },
    {
      $set: {
        status: "Completed",
        updatedAt: new Date(),
        updatedBy: new Types.ObjectId(loginUser.employeeId),
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
      title: `Task Completed: ${updatedTask.taskId} (${updatedTask.type})`,
      message: [
        updatedTask.caseNo ? `Case No: ${updatedTask.caseNo}` : null,
        updatedTask.type === "payment"
          ? `Payment of ${updatedTask.amount} (${updatedTask.paymentType}) has been completed.`
          : `${updatedTask.title} has been marked as completed.`,
        updatedTask.description ? `Note: ${updatedTask.description}` : null,
      ]
        .filter(Boolean)
        .join(", "),
    },
    organization: loginUser.organization._id,
  });

  return updatedTask;
}
