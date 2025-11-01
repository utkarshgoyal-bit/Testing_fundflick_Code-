import { Types } from 'mongoose';
import { TASK_STATUS } from '../../enums/task.enum';
import { LoginUser } from '../../interfaces';
import { IAddTaskPayload } from '../../interfaces/task.interface';
import TasksSchema from '../../schema/tasks';
import { ERROR } from '../../shared/enums';
import { TasksUpdateNotification } from '../../socket/sendNotification';

export default async function updateScheduledRecurringTask({
  body,
  loginUser,
}: {
  body: IAddTaskPayload & { _id: string };
  loginUser: LoginUser;
}) {
  const { _id, ...payload } = body;
  const updatedTask = await TasksSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(_id),
      status: { $in: [TASK_STATUS.UPCOMING, TASK_STATUS.SCHEDULED] },
    },
    { ...payload, updatedBy: new Types.ObjectId(loginUser.employeeId) },
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
      ...updatedTask.users.map(user =>
        user instanceof Types.ObjectId || typeof user === 'string' ? user : user.employeeId
      ),
      updatedTask.createdBy,
    ],
    message: {
      taskId: updatedTask.taskId,
      title: `Scheduled/Recurring Task Updated: ${updatedTask.taskId} (${updatedTask.type})`,
      message: [
        updatedTask.caseNo ? `Case No: ${updatedTask.caseNo}` : null,
        `${updatedTask.title} has been updated.`,
        updatedTask.description ? `Note: ${updatedTask.description}` : null,
      ]
        .filter(Boolean)
        .join(', '),
    },
    organization: loginUser.organization._id,
  });

  return updatedTask;
}
