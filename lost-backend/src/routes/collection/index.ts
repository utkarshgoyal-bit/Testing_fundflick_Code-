import express, { Express } from "express";
import { uploadMiddleware } from "../../middleware/collection/excelFileUplode";
import { upload } from "../../middleware/fileUpload";
import { hasPermission } from "../../middleware";
import { PERMISSIONS } from "../../shared/enums/permissions";
const router: Express = express();
import {
  bulkUploadCases,
  getCasesController,
  updateBranchController,
  getCaseNoDetailsController,
  paymentCollectionController,
  getPaymentsController,
  updateFollowUpCaseIDController,
  getFollowUpController,
  getCaseNoFollowUpDetailsController,
  editLegalNoticeController,
  editCompanyNoticeController,
  getDailyPaymentsReportController,
  getDailyFollowUpReportController,
  assignedCaseController,
  unassignCaseController,
  caseLocationController,
  exportCasesByDateController,
  dashboardDataController,
  addCaseRemarksController,
  deleteCaseRemarkController,
  addCaseContactController,
  dashboardReportDataController,
} from "../../controller/collection/index";

router.get("/", hasPermission(PERMISSIONS.COLLECTION_VIEW), getCasesController);
router.post("/case/location", hasPermission(PERMISSIONS.COLLECTION_UPDATE_LOCATION), caseLocationController);
router.post("/case/export", hasPermission(PERMISSIONS.COLLECTION_EXPORT_CASES), exportCasesByDateController);
router.post(
  "/updateCasePayment/:caseId",
  hasPermission(PERMISSIONS.COLLECTION_PAYMENT),
  upload.single("selfie"),
  paymentCollectionController
);
router.get("/case/:caseNo", getCaseNoDetailsController);
router.post("/case/remark/:caseNo", addCaseRemarksController);
router.delete("/case/remark/:caseNo/:remarkId", deleteCaseRemarkController);
router.post("/case/contact/:caseNo", addCaseContactController);
router.get("/casess/:caseNo", getCaseNoFollowUpDetailsController);
router.post(
  "/updateCaseFollowUp/:caseId",
  hasPermission(PERMISSIONS.COLLECTION_FOLLOWUP),
  upload.single("selfie"),
  updateFollowUpCaseIDController
);
router.post("/upload", uploadMiddleware, hasPermission(PERMISSIONS.COLLECTION_UPLOAD), bulkUploadCases);
router.get("/payments", getPaymentsController);
router.put("/update-branch", hasPermission(PERMISSIONS.COLLECTION_UPDATE_BRANCH), updateBranchController);
router.get("/getFollowup", getFollowUpController);
router.post("/edit-legalNotice", editLegalNoticeController);
router.post("/edit-companyNotice", editCompanyNoticeController);
router.put("/assignCases", hasPermission(PERMISSIONS.COLLECTION_ASSIGN_CASE), assignedCaseController);
router.put("/unassignCase", hasPermission(PERMISSIONS.COLLECTION_UNASSIGN_CASE), unassignCaseController);
router.get(
  "/dailyReports/payments",
  hasPermission(PERMISSIONS.COLLECTION_VIEW_DAILY_PAYMENTS),
  getDailyPaymentsReportController
);
router.get(
  "/dailyReports/follow-up",
  hasPermission(PERMISSIONS.COLLECTION_VIEW_DAILY_FOLLOWUPS),
  getDailyFollowUpReportController
);
router.get("/dashboard", hasPermission(PERMISSIONS.COLLECTION_DASHBOARD_VIEW), dashboardDataController);
router.get("/reports", hasPermission(PERMISSIONS.COLLECTION_DASHBOARD_VIEW), dashboardReportDataController);
export default router;
