import moment from 'moment-timezone';
import { Types } from 'mongoose';
import {
  TASK_DASHBOARD_TYPE_ENUM,
  TASK_DASHBOARD_TYPES,
  TASK_STATUS,
} from '../../../enums/task.enum';
import { LoginUser } from '../../../interfaces';
import { ITaskDashboard } from '../../../interfaces/task.interface';
import { UserSchema } from '../../../schema';
import TasksSchema from '../../../schema/tasks';
import { ROLES } from '../../../shared/enums';

async function fetchTaskDashboard(
  loginUser: LoginUser,
  type: TASK_DASHBOARD_TYPE_ENUM,
  incompleteTasksFilter?: 'pending' | 'inProgress'
): Promise<{ data: ITaskDashboard }> {
  const {
    organization: { _id: organizationId },
    employeeId,
    role: userRole,
  } = loginUser;

  const isSuperAdmin = userRole === ROLES.SUPERADMIN;
  const timezone = 'Asia/Kolkata';
  const startOfToday = moment.tz(timezone).startOf('day').valueOf();
  const endOfToday = moment.tz(timezone).endOf('day').valueOf();
  const teamTasks = [];
  const matchUser: { [key: string]: unknown } = {
    organizations: {
      $in: [organizationId],
    },
    branches: {
      $in: loginUser.branches,
    },
    role: { $ne: ROLES.SUPERADMIN },
    employeeId: { $ne: employeeId },
  };
  if (isSuperAdmin) {
    delete matchUser.role;
    delete matchUser.branches;
  }

  const usersUnderLoginUser = await UserSchema.find(matchUser, {
    employeeId: 1,
    _id: 1,
  });
  const matchUsersTask = {
    organizationId,
    isDeleted: false,
    MONGO_DELETED: false,
    'users.employeeId': {
      $in: usersUnderLoginUser.map(user => new Types.ObjectId(user.employeeId)),
    },

    status: {
      $in: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED],
    },
  };
  const usersTasks = await TasksSchema.find(matchUsersTask, {
    acceptedBy: 1,
    status: 1,
    users: 1,
  });

  teamTasks.push(...usersTasks);

  const matchOrg: { [key: string]: unknown } = {
    organizationId,
    isDeleted: false,
    MONGO_DELETED: false,
    status: {
      $nin: [TASK_STATUS.SCHEDULED, TASK_STATUS.UPCOMING],
    },
  };

  if (type === TASK_DASHBOARD_TYPES.INDIVIDUAL) {
    matchOrg.$or = [{ 'users.employeeId': new Types.ObjectId(employeeId) }];
  }
  if (type === TASK_DASHBOARD_TYPES.TEAM) {
    matchOrg.$or = [
      { createdBy: new Types.ObjectId(employeeId) },
      { 'cc.employeeId': new Types.ObjectId(employeeId) },
      { 'users.employeeId': new Types.ObjectId(employeeId) },
    ];
  }

  if (isSuperAdmin) {
    delete matchOrg.$or;
  }

  const allTasks = await TasksSchema.find(matchOrg);

  const totalTasks = allTasks.length;

  const completedTasks = allTasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;

  const incompleteTasks = allTasks.filter(
    task =>
      task.status !== TASK_STATUS.COMPLETED &&
      task.status !== TASK_STATUS.SCHEDULED &&
      task.status !== TASK_STATUS.UPCOMING
  ).length;

  const assignedToMeTasks = allTasks.filter(task =>
    task.users?.some(user => user.employeeId?.toString() === employeeId.toString())
  ).length;

  const dueTodayTasks = allTasks.filter(task => {
    if (typeof task.startDate !== 'number') return false;
    const startDateMs = task.startDate < 1e12 ? task.startDate * 1000 : task.startDate;
    const dueAfterDays = typeof task.dueAfterDays === 'number' ? task.dueAfterDays : 0;
    const dueDate = moment.tz(startDateMs, timezone).add(dueAfterDays, 'days').valueOf();
    return dueDate >= startOfToday && dueDate <= endOfToday;
  }).length;

  const priorityWiseIncompleteTasks = {
    high: 0,
    medium: 0,
    low: 0,
  };

  const statusWiseTasks = {
    pending: 0,
    inProgress: 0,
    underReview: 0,
    rejected: 0,
    onHold: 0,
    completed: 0,
    upcoming: 0,
    overdue: 0,
  };

  allTasks.forEach(task => {
    if (task.status !== TASK_STATUS.COMPLETED && task.status !== TASK_STATUS.SCHEDULED) {
      if (
        task.priorityOfTask === 1 &&
        ((incompleteTasksFilter === 'pending' && task.status === TASK_STATUS.PENDING) ||
          (incompleteTasksFilter === 'inProgress' && task.status === TASK_STATUS.IN_PROGRESS))
      )
        priorityWiseIncompleteTasks.high++;
      else if (
        task.priorityOfTask === 2 &&
        ((incompleteTasksFilter === 'pending' && task.status === TASK_STATUS.PENDING) ||
          (incompleteTasksFilter === 'inProgress' && task.status === TASK_STATUS.IN_PROGRESS))
      )
        priorityWiseIncompleteTasks.medium++;
      else if (
        task.priorityOfTask === 3 &&
        ((incompleteTasksFilter === 'pending' && task.status === TASK_STATUS.PENDING) ||
          (incompleteTasksFilter === 'inProgress' && task.status === TASK_STATUS.IN_PROGRESS))
      )
        priorityWiseIncompleteTasks.low++;
    }

    switch (task.status) {
      case TASK_STATUS.PENDING:
        statusWiseTasks.pending++;
        break;
      case TASK_STATUS.IN_PROGRESS:
        statusWiseTasks.inProgress++;
        break;
      case TASK_STATUS.UNDER_REVIEW:
        statusWiseTasks.underReview++;
        break;
      case TASK_STATUS.REJECTED:
        statusWiseTasks.rejected++;
        break;
      case TASK_STATUS.ON_HOLD:
        statusWiseTasks.onHold++;
        break;
      case TASK_STATUS.COMPLETED:
        statusWiseTasks.completed++;
        break;
      case TASK_STATUS.UPCOMING:
        statusWiseTasks.upcoming++;
        break;
      case TASK_STATUS.OVERDUE:
        statusWiseTasks.overdue++;
        break;
      default:
        break;
    }
  });

  const dashboardData: ITaskDashboard = {
    completedTasks,
    incompleteTasks,
    totalTasks,
    assignedToMeTasks,
    dueTodayTasks,
    priorityWiseIncompleteTasks,
    statusWiseTasks,
  };

  if (type === TASK_DASHBOARD_TYPES.TEAM) {
    dashboardData.teamTasks = teamTasks;
  }

  return { data: dashboardData };
}

export default fetchTaskDashboard;
