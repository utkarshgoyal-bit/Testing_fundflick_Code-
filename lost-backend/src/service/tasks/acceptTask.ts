import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { TASK_STATUS } from '../../enums/task.enum';
import { LoginUser } from '../../interfaces';
import { EmployeeSchema } from '../../schema';
import TasksSchema from '../../schema/tasks';
import { ERROR } from '../../shared/enums';
import { TasksUpdateNotification } from '../../socket/sendNotification';
import { getOrganizationSettings } from '../organizationConfigs/getOrganizationConfigs';

export default async function acceptTask({
  loginUser,
  taskId,
}: {
  loginUser: LoginUser;
  taskId: string;
}) {
  const { employeeId, organization } = loginUser;
  const settings = await getOrganizationSettings({
    organizationId: organization._id,
  });
  const timezone = settings.find(s => s.id === 'timezone')?.value || 'Asia/Kolkata';
  const { status: currentTaskStatus } = (await TasksSchema.findById(taskId)) || {};
  if (
    currentTaskStatus === TASK_STATUS.IN_PROGRESS ||
    currentTaskStatus === TASK_STATUS.COMPLETED
  ) {
    throw ERROR.TASK_ALREADY_ACCEPTED_OR_COMPLETED;
  }
  const employeeDetails = await EmployeeSchema.findById({
    _id: new Types.ObjectId(employeeId),
    organization: organization,
  });
  if (!employeeDetails) {
    throw new Error('Employee not found');
  }
  const employeeName = employeeDetails.firstName + ' ' + employeeDetails.lastName;
  const acceptedTask = await TasksSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(taskId), organizationId: loginUser.organization._id },
    {
      $set: {
        acceptedBy: new Types.ObjectId(employeeId),
        status: TASK_STATUS.IN_PROGRESS,
      },
      $push: {
        timeline: {
          comment: `Task status changed from ${currentTaskStatus} to ${TASK_STATUS.IN_PROGRESS}`,
          createdBy: new Types.ObjectId(employeeId),
          createdByName: employeeName,
          createdAt: moment().tz(timezone).unix(),
        },
      },
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
      ...acceptedTask.users.map(user =>
        user instanceof Types.ObjectId || typeof user === 'string' ? user : user.employeeId
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
        .join(', '),
    },
    organization: loginUser.organization._id,
  });

  return acceptedTask;
}
