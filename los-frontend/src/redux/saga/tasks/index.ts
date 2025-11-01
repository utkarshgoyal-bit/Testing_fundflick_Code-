import deleteTasks from './deleteTask.saga';
import deleteScheduledRecurringTasks from './deleteScheduledRecurringTask.saga';
import editTask from './editTask.saga';
import updateScheduledRecurringTask from './updateScheduledRecurringTask.saga';
import fetchTasks from './fetchTasks.saga';
import fetchScheduledRecurringTasks from './fetchScheduledRecurringTasks.saga';
import createTaskSaga from './createTaskSaga.saga';
import markAsDone from './markAsDone.saga';
import fileHandlers from './fileHandler.saga';
import stopTaskRepeat from './stopTaskRepeat.saga';
import taskComment from './taskComment.saga';
import acceptTask from './acceptTask.saga';
import pinTask from './pinTask.saga';
import fetchTaskDashboard from './fetchDashboard.saga';
import createBulkTaskSaga from './bulkTasks/createBulkTasks.saga';

export {
  deleteTasks,
  deleteScheduledRecurringTasks,
  editTask,
  updateScheduledRecurringTask,
  fetchTasks,
  fetchScheduledRecurringTasks,
  createTaskSaga,
  markAsDone,
  fileHandlers,
  stopTaskRepeat,
  taskComment,
  acceptTask,
  pinTask,
  fetchTaskDashboard,
  createBulkTaskSaga
};
