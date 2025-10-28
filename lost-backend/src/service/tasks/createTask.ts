import { Types } from "mongoose";
import TasksSchema from "../../models/tasks";
import { TasksUpdateNotification } from "../../socket/sendNotification";

export default async function createTask({ body, loginUser }: { body: any; loginUser: any }) {
  const newTaskId = await TasksSchema.countDocuments();
  const tasksData = await TasksSchema.create({
    ...body,
    createdBy: new Types.ObjectId(loginUser.employeeId),
    createdAt: Date.now(),
    updatedBy: new Types.ObjectId(loginUser.employeeId),
    status: "Pending",
    taskId: newTaskId + 1,
    organization: loginUser.organization._id,
  });
  await TasksUpdateNotification({
    users: [
      ...body.users.map((user: any) =>
        user instanceof Types.ObjectId || typeof user === "string" ? user : user.userDetails
      ),
      body.createdBy,
    ],
    message: {
      taskId: newTaskId + 1,
      title: `New Task: ${newTaskId + 1} (${body.type})`,
      message: [
        body.caseNo ? `Case No: ${body.caseNo}` : null,
        `Task: ${body.title} has been assigned.`,
        body.description ? `Description: ${body.description}` : null,
      ]
        .filter(Boolean)
        .join(", "),
    },
    organization: loginUser.organization._id,
  });

  return tasksData;
}
