import express, { Express } from 'express';
import { hasPermission } from '../middleware';
import { ROUTES } from '../shared/enums';
import { PERMISSIONS } from '../shared/enums/permissions';
import branchRoutes from './branches';
import collectionRoutes from './collection';
import creditRouter from './credit';
import customerFileRoutes from './customerFile';
import dashboardRoutes from './dashboard';
import employeeRoutes from './employee';
import organizationConfigsRoutes from './organizationConfigs';
import organizationRoutes from './organizations';
import pendencyRouter from './pendency';
import rolesRouter from './role';
import taskRoutes from './tasks';
import clientRoutes from './tasks/client';
import clientLedgerRoutes from './tasks/clientLedger';
import departmentRoutes from './tasks/department';
import serviceRoutes from './tasks/service';
import telephoneQuestionRoutes from './teleVerification';
import userRoutes from './users';
const app: Express = express();

app.use(ROUTES.USER, userRoutes);
app.use(ROUTES.ORGANIZATION, hasPermission(PERMISSIONS.ORGANIZATION_TAB), organizationRoutes);
app.use(ROUTES.ORGANIZATION_CONFIGS, organizationConfigsRoutes);
app.use(ROUTES.COLLECTION, hasPermission(PERMISSIONS.COLLECTION_VIEW), collectionRoutes);
app.use(ROUTES.BRANCH, hasPermission(PERMISSIONS.BRANCH_VIEW), branchRoutes);
app.use(
  ROUTES.TELEPHONE_QUESTIONS,
  hasPermission(PERMISSIONS.TELEPHONE_QUESTION_VIEW),
  telephoneQuestionRoutes
);
app.use(ROUTES.EMPLOYEE, hasPermission(PERMISSIONS.EMPLOYEE_VIEW), employeeRoutes);
app.use(ROUTES.CUSTOMER_FILE, hasPermission(PERMISSIONS.CUSTOMER_FILE_VIEW), customerFileRoutes);
app.use(ROUTES.DASHBOARD, hasPermission(PERMISSIONS.LOS_DASHBOARD_VIEW), dashboardRoutes);
app.use(ROUTES.TASKS, hasPermission(PERMISSIONS.TASK_VIEW), taskRoutes);
app.use(ROUTES.CLIENT, clientRoutes);
app.use(ROUTES.CLIENT_LEDGER, clientLedgerRoutes);
app.use(ROUTES.SERVICE, serviceRoutes);
app.use(ROUTES.DEPARTMENT, departmentRoutes);
app.use(ROUTES.PENDENCY, hasPermission(PERMISSIONS.PENDENCY_VIEW), pendencyRouter);
app.use(ROUTES.ROLE, rolesRouter);
app.use(ROUTES.CREDIT, creditRouter);

export default app;
