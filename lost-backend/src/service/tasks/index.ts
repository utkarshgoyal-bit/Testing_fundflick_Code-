import acceptTask from './acceptTask';
import addComments from './addComment';
import createBulkTask from './BulkTasks/createBulkTask';
import createRepeatedTasks from './createRepeatedTasks';
import createTask from './createTask';
import { fetchTaskDashboard } from './dashboard';
import deleteScheduledRecurringTask from './deleteScheduledRecurringTask';
import deleteTask from './deleteTask';
import fetchScheduledRecurringTasks from './fetchScheduledRecurringTasks';
import fetchTasks from './fetchTasks';
import markTaskAsCompleted from './markTaskAsCompleted';
import pinTask from './pinTask';
import stopRepeat from './stopRepeat';
import updateScheduledRecurringTask from './updateScheduledRecurringTask';
import updateTask from './updateTask';

export default {
  addComments,
  createRepeatedTasks,
  createTask,
  deleteScheduledRecurringTask,
  deleteTask,
  fetchScheduledRecurringTasks,
  fetchTasks,
  markTaskAsCompleted,
  stopRepeat,
  updateScheduledRecurringTask,
  updateTask,
  acceptTask,
  pinTask,
  fetchTaskDashboard,
  createBulkTask,
};
