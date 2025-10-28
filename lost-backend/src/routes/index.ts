import express, { Express } from "express";
import { getIFSCDetails, ocrController } from "../controller";
import GetSignedUrl from "../controller/signedUrl";
import { hasPermission, verifyToken } from "../middleware";
import { upload } from "../middleware/fileUpload";
import morganMiddleware from "../middleware/loggerMiddleware";
import { ROUTES } from "../shared/enums";
import { PERMISSIONS } from "../shared/enums/permissions";
import authRoutes from "./auth";
import branchRoutes from "./branches";
import collectionRoutes from "./collection";
import customerFileRoutes from "./customerFile";
import dashboardRoutes from "./dashboard";
import employeeRoutes from "./employee";
import pendencyRouter from "./pendency";
import rolesRouter from "./role";
import taskRoutes from "./tasks";
import telephoneQuestionRoutes from "./teleVerification";
import userRoutes from "./users";
import creditRouter from "./credit";
import organizationRoutes from "./organizations";
const app: Express = express();

//Private routes
app.use(ROUTES.USER, verifyToken, morganMiddleware, userRoutes);
app.use(
  ROUTES.ORGANIZATION,
  verifyToken,
  morganMiddleware,
  hasPermission(PERMISSIONS.ORGANIZATION_TAB),
  organizationRoutes
);
app.use(ROUTES.COLLECTION, verifyToken, morganMiddleware, hasPermission(PERMISSIONS.COLLECTION_VIEW), collectionRoutes);

app.use(ROUTES.BRANCH, verifyToken, morganMiddleware, hasPermission(PERMISSIONS.BRANCH_VIEW), branchRoutes);
app.use(
  ROUTES.TELEPHONE_QUESTIONS,
  verifyToken,
  morganMiddleware,
  hasPermission(PERMISSIONS.TELEPHONE_QUESTION_VIEW),
  telephoneQuestionRoutes
);
app.use(ROUTES.EMPLOYEE, verifyToken, morganMiddleware, hasPermission(PERMISSIONS.EMPLOYEE_VIEW), employeeRoutes);
app.use(
  ROUTES.CUSTOMER_FILE,
  verifyToken,
  morganMiddleware,
  hasPermission(PERMISSIONS.CUSTOMER_FILE_VIEW),
  customerFileRoutes
);
app.use(
  ROUTES.DASHBOARD,
  verifyToken,
  morganMiddleware,
  hasPermission(PERMISSIONS.LOS_DASHBOARD_VIEW),
  dashboardRoutes
);
app.use(ROUTES.TASKS, verifyToken, morganMiddleware, hasPermission(PERMISSIONS.TASK_VIEW), taskRoutes);
app.use(ROUTES.PENDENCY, verifyToken, morganMiddleware, hasPermission(PERMISSIONS.PENDENCY_VIEW), pendencyRouter);
app.use(ROUTES.ROLE, verifyToken, morganMiddleware, rolesRouter);
app.use(ROUTES.CREDIT, verifyToken, morganMiddleware, creditRouter);

//public routes
app.use(ROUTES.SIGNED_URL, verifyToken, morganMiddleware, GetSignedUrl);
app.get(ROUTES.IFSC, morganMiddleware, getIFSCDetails);
app.post(ROUTES.OCR, upload.single("file"), morganMiddleware, ocrController);
app.use(ROUTES.AUTH, morganMiddleware, authRoutes);

export default app;
