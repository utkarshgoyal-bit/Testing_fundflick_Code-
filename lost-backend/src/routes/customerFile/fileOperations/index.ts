import express, { Express } from "express";

import { FileOperationsController } from "../../../controller";
import { hasPermission } from "../../../middleware";
import { upload } from "../../../middleware/fileUpload";
import { PERMISSIONS } from "../../../shared/enums/permissions";
const router: Express = express();

router.get("/vehicle-details", FileOperationsController.getVehicleRecords);
router.get("/customer-information", FileOperationsController.getCustomerInformation);
router.post("/customer-file-status", FileOperationsController.updatedCustomerFileStatus);
router.post("/customer-file-comment", FileOperationsController.fileComments);
router.post("/customer-file-payment", FileOperationsController.receiveFilePayment);
router.get("/file-handlers", FileOperationsController.fileHandlers);
router.post("/verify-step", hasPermission(PERMISSIONS.VERIFY_STEP), FileOperationsController.fileVerification);
router.post(
  "/telephone-verification",
  hasPermission(PERMISSIONS.TELEPHONE_VERIFICATION),
  FileOperationsController.telephoneVerification
);
router.post(
  "/:id/cibil-score",
  upload.fields([{ name: "cibilDetails[file]" }]),
  FileOperationsController.updatedCustomerCibilScore
);

export default router;
