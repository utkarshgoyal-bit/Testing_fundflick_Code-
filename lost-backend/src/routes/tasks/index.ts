import express, { Express } from 'express';
import { TaskController } from '../../controller/index';
import { hasPermission } from '../../middleware';
import { PERMISSIONS } from '../../shared/enums/permissions';
const router: Express = express();
router.get('/', hasPermission(PERMISSIONS.TASK_VIEW), TaskController.fetchTasks);
router.get('/dashboard', hasPermission(PERMISSIONS.TASK_VIEW), TaskController.fetchTaskDashboard);
router.post('/', hasPermission(PERMISSIONS.TASK_CREATE), TaskController.createTask);
router.post('/comment', hasPermission(PERMISSIONS.TASK_COMMENT), TaskController.addComment);
router.post('/accept/:taskId', hasPermission(PERMISSIONS.TASK_COMMENT), TaskController.acceptTask);
router.put('/', hasPermission(PERMISSIONS.TASK_UPDATE), TaskController.updateTask);
router.delete('/', hasPermission(PERMISSIONS.TASK_DELETE), TaskController.deleteTask);
router.patch('/completed', hasPermission(PERMISSIONS.TASK_COMMENT), TaskController.markComplete);
router.patch('/stopRepeat', hasPermission(PERMISSIONS.TASK_REPEAT), TaskController.stopRepeat);
router.patch('/pin/:taskId', TaskController.pinTask);
router.get(
  '/scheduled-recurring',
  hasPermission(PERMISSIONS.TASK_VIEW),
  TaskController.fetchScheduledRecurringTasks
);
router.put(
  '/scheduled-recurring',
  hasPermission(PERMISSIONS.TASK_UPDATE),
  TaskController.updateScheduledRecurringTask
);
router.delete(
  '/scheduled-recurring',
  hasPermission(PERMISSIONS.TASK_DELETE),
  TaskController.deleteScheduledRecurringTask
);
router.post('/bulk', hasPermission(PERMISSIONS.TASK_CREATE), TaskController.createBulkTask);

export default router;
