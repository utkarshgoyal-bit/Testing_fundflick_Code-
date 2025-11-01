import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { REPEAT_STATUS, TASK_STATUS } from '../../enums/task.enum';
import { LoginUser } from '../../interfaces';
import { IAddTaskPayload } from '../../interfaces/task.interface';
import { EmployeeSchema } from '../../schema';
import TasksSchema from '../../schema/tasks';
import { TasksUpdateNotification } from '../../socket/sendNotification';
import { generateTaskId } from '../../utils/generateTaskId';
import { getOrganizationSettings } from '../organizationConfigs/getOrganizationConfigs';

export default async function createTask({
  body,
  loginUser,
}: {
  body: IAddTaskPayload;
  loginUser: LoginUser;
}) {
  const {
    organization: { _id: organizationId, name: orgName },
    employeeId,
  } = loginUser;
  const settings = await getOrganizationSettings({
    organizationId: organizationId,
  });
  const timezone = settings.find(s => s.id === 'timezone')?.value || 'Asia/Kolkata';
  const taskId = await generateTaskId(organizationId.toString(), orgName);

  const isNoRepeat = body.repeat == REPEAT_STATUS.NO_REPEAT;
  const startDate = moment(body.startDate).tz(timezone);
  const todayDate = moment(new Date()).tz(timezone);
  const isFutureTask = todayDate.isBefore(startDate);
  let status = TASK_STATUS.PENDING;

  if (isNoRepeat && isFutureTask) {
    status = TASK_STATUS.UPCOMING;
  }
  if (!isNoRepeat) {
    status = TASK_STATUS.SCHEDULED;
  }
  const employeeDetails = await EmployeeSchema.findById({
    _id: new Types.ObjectId(employeeId),
    organization: organizationId,
  });
  if (!employeeDetails) {
    throw new Error('Employee not found');
  }
  const employeeName = employeeDetails.firstName + ' ' + employeeDetails.lastName;

  const taskPayload = {
    ...body,
    orgName,
    clientId: new Types.ObjectId(body.clientId),
    serviceId: new Types.ObjectId(body.serviceId),
    createdBy: new Types.ObjectId(employeeId),
    updatedBy: new Types.ObjectId(employeeId),
    status,
    taskId,
    organizationId,
    timeline: {
      createdBy: employeeId,
      comment: 'Task Created!!',
      createdByName: employeeName,
      createdAt: moment().tz(timezone).unix(),
    },
    createdAt: moment().tz(timezone).unix(),
  };

  const tasksData = await TasksSchema.create(taskPayload);

  await TasksUpdateNotification({
    users: [
      ...body.users.map(user =>
        user instanceof Types.ObjectId || typeof user === 'string' ? user : user.employeeId
      ),
      body.createdBy,
    ],
    message: {
      taskId,
      title: `New Task: ${taskId} (${body.type})`,
      message: [
        body.caseNo ? `Case No: ${body.caseNo}` : null,
        `Task: ${body.title} has been assigned.`,
        body.description ? `Description: ${body.description}` : null,
      ]
        .filter(Boolean)
        .join(', '),
    },
    organization: loginUser.organization._id,
  });

  return tasksData;
}
