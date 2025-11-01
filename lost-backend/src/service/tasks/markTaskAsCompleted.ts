import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { TASK_STATUS } from '../../enums/task.enum';
import { LoginUser } from '../../interfaces';
import { EmployeeSchema } from '../../schema';
import TasksSchema from '../../schema/tasks';
import ClientLedgerSchema from '../../schema/tasks/clientLedger';
import { ERROR } from '../../shared/enums';
import { TasksUpdateNotification } from '../../socket/sendNotification';
import { getOrganizationSettings } from '../organizationConfigs/getOrganizationConfigs';

export default async function markTaskAsCompleted({
  loginUser,
  body,
}: {
  loginUser: LoginUser;
  body: { _id: string };
}) {
  const { _id } = body;
  const {
    organization: { _id: organizationId },
    employeeId,
  } = loginUser;
  const settings = await getOrganizationSettings({
    organizationId: organizationId,
  });
  const timezone = settings.find(s => s.id === 'timezone')?.value || 'Asia/Kolkata';
  const { status: oldTaskStatus } = (await TasksSchema.findById(_id)) || {};
  const updatedTask = await TasksSchema.findOne({
    _id: new Types.ObjectId(_id),
    organizationId: new Types.ObjectId(organizationId),
    status: { $in: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.UNDER_REVIEW] },
  });
  if (!updatedTask) {
    throw ERROR.TASK_NOT_FOUND;
  }
  const isNotCompletedTask =
    updatedTask?.status !== TASK_STATUS.IN_PROGRESS &&
    updatedTask?.status !== TASK_STATUS.UNDER_REVIEW;

  if (isNotCompletedTask) {
    throw ERROR.INVALID_OPERATION;
  }

  if (updatedTask.approvalBased && updatedTask.createdBy.toString() !== employeeId.toString()) {
    updatedTask.status = TASK_STATUS.UNDER_REVIEW;
  } else {
    updatedTask.status = TASK_STATUS.COMPLETED;
    if (updatedTask.clientId) {
      await ClientLedgerSchema.create({
        title: updatedTask.title || updatedTask.type,
        serviceId: updatedTask.serviceId,
        clientId: updatedTask.clientId,
        dateOfCompletion: moment().unix(),
        completedBy: new Types.ObjectId(employeeId),
        organizationId: new Types.ObjectId(organizationId),
        createdAt: moment().unix(),
        createdBy: new Types.ObjectId(employeeId),
        updatedBy: new Types.ObjectId(employeeId),
        timeline: [
          {
            title: `Task Completed: ${updatedTask.title} - ${updatedTask.taskId}`,
            remark: `${updatedTask.title} has been completed.`,
            createdBy: new Types.ObjectId(employeeId),
            createdAt: moment().tz(timezone).unix(),
          },
        ],
      });
    }
  }
  const employeeDetails = await EmployeeSchema.findById({
    _id: new Types.ObjectId(employeeId),
    organization: organizationId,
  });
  if (!employeeDetails) {
    throw new Error('Employee not found');
  }
  const employeeName = employeeDetails.firstName + ' ' + employeeDetails.lastName;
  updatedTask.timeline.push({
    comment: `Task status changed from ${oldTaskStatus} to ${updatedTask.status}`,
    createdBy: new Types.ObjectId(employeeId),
    createdByName: employeeName,
    createdAt: moment().tz(timezone).unix(),
  });
  await updatedTask.save();

  await TasksUpdateNotification({
    users: [
      ...updatedTask.users.map(user =>
        user instanceof Types.ObjectId || typeof user === 'string' ? user : user.employeeId
      ),
      updatedTask.createdBy,
    ],
    message: {
      taskId: updatedTask.taskId,
      title: `Task Completed: ${updatedTask.taskId} (${updatedTask.type})`,
      message: [
        updatedTask.caseNo ? `Case No: ${updatedTask.caseNo}` : null,
        updatedTask.type === 'payment'
          ? `Payment of ${updatedTask.amount} (${updatedTask.paymentType}) has been completed.`
          : `${updatedTask.title} has been marked as completed.`,
        updatedTask.description ? `Note: ${updatedTask.description}` : null,
      ]
        .filter(Boolean)
        .join(', '),
    },
    organization: organizationId,
  });

  return updatedTask;
}
