import { Types } from 'mongoose';
import { TASK_STATUS } from '../../enums/task.enum';
import { LoginUser } from '../../interfaces';
import { ClientSchema } from '../../schema';
import TasksSchema from '../../schema/tasks';

const taskProjection = {
  _id: 1,
  type: 1,
  caseNo: 1,
  users: 1,
  paymentType: 1,
  title: 1,
  description: 1,
  repeat: 1,
  taskId: 1,
  startDate: 1,
  dueAfterDays: 1,
  acceptedBy: 1,
  comments: 1,
  createdAt: 1,
  createdBy: 1,
  isDeleted: 1,
  status: 1,
  updatedAt: 1,
  amount: 1,
  isPinned: 1,
  priorityOfTask: 1,
  weeklyDay: 1,
  monthlyDay: 1,
  yearlyDay: 1,
  yearlyMonth: 1,
  serviceId: 1,
  clientId: 1,
  timeline: 1,
  returnName: 1,
  cc: 1,
};

export default async function fetchScheduledRecurringTasks({
  loginUser,
  active,
  statusFilter,
  page,
}: {
  loginUser: LoginUser;
  active: boolean;
  statusFilter: string;
  page: number;
}) {
  const {
    organization: { _id: organizationId },
  } = loginUser;
  const lowerStatus = statusFilter?.toLowerCase() || 'all';
  const taskDbQuery = {
    ...(organizationId && { organizationId }),
    ...(lowerStatus && lowerStatus === 'scheduled' && { status: [TASK_STATUS.SCHEDULED] }),
    ...(lowerStatus && lowerStatus === 'upcoming' && { status: [TASK_STATUS.UPCOMING] }),
    ...(lowerStatus &&
      lowerStatus === 'all' && { status: [TASK_STATUS.SCHEDULED, TASK_STATUS.UPCOMING] }),
    ...(active && { status: { $ne: 'Completed' } }),
    MONGO_DELETED: false,
  };
  const tasksData = await TasksSchema.find(taskDbQuery)
    .populate('createdBy', ['firstName', 'middleName', 'lastName'])
    .populate({
      path: 'serviceId',
      select: 'serviceName departmentId',
      populate: {
        path: 'departmentId',
        model: 'departments',
        select: ['departmentName'],
        match: { MONGO_DELETED: { $ne: true } },
      },
    })
    .populate({
      path: 'clientId',
      select: 'name clientType email mobile organizationName services',
      match: { MONGO_DELETED: { $ne: true } },
    })
    .populate('comments.createdBy', ['firstName', 'middleName', 'lastName'])
    .limit(10)
    .skip((page - 1) * 10)
    .select(taskProjection)
    .sort({ priorityOfTask: -1, createdAt: -1 })
    .lean();

  const mappedTask = await Promise.all(
    tasksData.map(async task => {
      const serviceId = task?.serviceId?._id && new Types.ObjectId(task.serviceId._id);
      if (task.serviceId) {
        const clientDetails = await ClientSchema.findOne({
          services: { $in: [serviceId] },
          MONGO_DELETED: { $ne: true },
        }).select('name clientType email mobile services');

        if (clientDetails) {
          Object.assign(task, { clientDetails });
        } else {
          Object.assign(task, { clientDetails: null });
        }
      }
      return task;
    })
  );

  return { data: mappedTask, total: mappedTask.length };
}
