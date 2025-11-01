import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { TASK_STATUS } from '../../enums/task.enum';
import formatDateToMessage from '../../helper/formatDateToMessage';
import { LoginUser } from '../../interfaces';
import { UserSchema } from '../../schema';
import TasksSchema from '../../schema/tasks';
import { ROLES } from '../../shared/enums';
import { getOrganizationSettings } from '../organizationConfigs/getOrganizationConfigs';
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
export default async function fetchTasks({
  loginUser,
  active,
  activeFilter,
  statusFilter,
  page,
}: {
  loginUser: LoginUser;
  active: boolean;
  activeFilter: string;
  statusFilter: string;
  page: number;
}) {
  const {
    organization: { _id: organizationId },
    employeeId,
    role: userRole,
  } = loginUser;
  const isSuperAdmin = userRole === ROLES.SUPERADMIN;
  const settings = await getOrganizationSettings({
    organizationId: organizationId,
  });
  const timezone = settings.find(s => s.id === 'timezone')?.value || 'Asia/Kolkata';
  const dbQuery = {
    ...(activeFilter == 'all' &&
      !isSuperAdmin && {
        $or: [
          { createdBy: new Types.ObjectId(employeeId) },
          { 'users.employeeId': new Types.ObjectId(employeeId) },
          { 'cc.employeeId': new Types.ObjectId(employeeId) },
        ],
      }),
    ...(activeFilter == 'assignedByMe' && { createdBy: new Types.ObjectId(employeeId) }),
    ...(activeFilter === 'assignedToMe' && { 'users.employeeId': new Types.ObjectId(employeeId) }),
    ...(activeFilter === 'cc' && {
      'cc.employeeId': new Types.ObjectId(employeeId),
    }),
    ...(statusFilter &&
      statusFilter.toLowerCase() !== 'all' && { status: { $in: [statusFilter] } }),
    ...(statusFilter &&
      statusFilter.toLowerCase() === 'all' && {
        status: { $nin: [TASK_STATUS.UPCOMING, TASK_STATUS.SCHEDULED] },
      }),
    ...(active && { status: { $ne: TASK_STATUS.COMPLETED } }),
    ...(organizationId && { organizationId }),
    MONGO_DELETED: false,
  };

  const pinnedData = await UserSchema.findOne({
    employeeId: new Types.ObjectId(employeeId),
    MONGO_DELETED: false,
  }).select('pinnedTask');

  const pinnedIds = pinnedData?.pinnedTask || [];

  const taskDbQuery = { ...dbQuery, _id: { $nin: pinnedIds } };
  const pinnedTaskDbQuery = { ...dbQuery, _id: { $in: pinnedIds }, MONGO_DELETED: false };

  const [tasksData, pinnedTasksData] = await Promise.all([
    TasksSchema.find(taskDbQuery)
      .populate('createdBy', ['firstName', 'middleName', 'lastName'])
      .populate('serviceId')
      .populate('clientId')
      .populate('comments.createdBy', ['firstName', 'middleName', 'lastName'])
      .limit(10)
      .skip((page - 1) * 10)
      .select(taskProjection)
      .sort({ priorityOfTask: -1, createdAt: -1 })
      .lean(),
    TasksSchema.find(pinnedTaskDbQuery)
      .populate('serviceId')
      .populate('clientId')
      .populate('createdBy', ['firstName', 'middleName', 'lastName'])
      .populate('comments.createdBy', ['firstName', 'middleName', 'lastName'])
      .select(taskProjection)
      .sort({ priorityOfTask: -1, createdAt: -1 })
      .lean(),
  ]);

  pinnedTasksData.forEach(task => {
    task.isPinned = true;
  });

  let data = [...pinnedTasksData, ...tasksData];

  data = data.map(task => ({
    ...task,
    dueDateInMessage:
      task.status === TASK_STATUS.COMPLETED
        ? ''
        : formatDateToMessage({
            epochTimestamp: moment(task.startDate)
              .add(task?.dueAfterDays || 0, 'days')
              .valueOf(),
            timezone,
          }),
    isPinned: task.isPinned || false,
  }));

  data.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const aCompleted = a.status === TASK_STATUS.COMPLETED;
    const bCompleted = b.status === TASK_STATUS.COMPLETED;
    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;

    if (a.priorityOfTask !== b.priorityOfTask) {
      return (b?.priorityOfTask ?? 0) - (a?.priorityOfTask ?? 0);
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const tasksWithSortedTimeline = data.map(task => ({
    ...task,
    timeline: task.timeline?.sort((alpha, beta) => beta.createdAt - alpha.createdAt),
  }));
  return { data: tasksWithSortedTimeline, total: tasksWithSortedTimeline.length };
}
