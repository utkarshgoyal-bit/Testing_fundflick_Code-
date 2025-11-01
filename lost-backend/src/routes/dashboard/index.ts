import express, { Express } from 'express';
import { DashboardController } from '../../controller/index';
import { hasPermission } from '../../middleware';
import { PERMISSIONS } from '../../shared/enums/permissions';
const router: Express = express();
router.get('/', hasPermission(PERMISSIONS.LOS_DASHBOARD_VIEW), DashboardController.getDashboard);
export default router;
