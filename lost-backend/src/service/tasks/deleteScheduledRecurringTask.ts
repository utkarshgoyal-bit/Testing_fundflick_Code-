import { Types } from 'mongoose';
import { TASK_STATUS } from '../../enums/task.enum';
import { LoginUser } from '../../interfaces';
import TasksSchema from '../../schema/tasks';
import { ERROR } from '../../shared/enums';
import { TasksUpdateNotification } from '../../socket/sendNotification';

export default async function deleteScheduledRecurringTask({
  loginUser,
  body,
}: {
  loginUser: LoginUser;
  body: { _id: string | Types.ObjectId };
}) {
  const { _id } = body;
  const {
    organization: { _id: organizationId },
    employeeId,
  } = loginUser;
  const deletedTask = await TasksSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(_id),
      createdBy: new Types.ObjectId(employeeId),
      organizationId: organizationId,
      status: { $in: [TASK_STATUS.UPCOMING, TASK_STATUS.SCHEDULED] },
    },
    {
      MONGO_DELETED: true,
      updatedAt: new Date(),
      updatedBy: new Types.ObjectId(employeeId),
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
        user instanceof Types.ObjectId || typeof user === 'string' ? user : user.employeeId
      ),
      deletedTask.createdBy,
    ],
    message: {
      taskId: deletedTask.taskId,
      title: `Scheduled/Recurring Task Deleted: ${deletedTask.taskId} (${deletedTask.type})`,
      message: [
        deletedTask.caseNo ? `Case No: ${deletedTask.caseNo}` : null,
        `${deletedTask.title} has been deleted.`,
        deletedTask.description ? `Note: ${deletedTask.description}` : null,
      ]
        .filter(Boolean)
        .join(', '),
    },
    organization: loginUser.organization._id,
  });

  return deletedTask;
}
