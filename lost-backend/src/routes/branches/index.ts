import express, { Express } from "express";
import { hasPermission } from "../../middleware";
import { PERMISSIONS } from "../../shared/enums/permissions";
import {
  addBranchController,
  blockBranchController,
  deleteBranchController,
  editBranchesController,
  getBranchByIdController,
  getBranchController,
  getChildBranchController,
  unblockBranchController,
} from "../../controller/branches";
const router: Express = express();
router.get("/", hasPermission(PERMISSIONS.BRANCH_VIEW), getBranchController);
router.get("/children/:parentId", hasPermission(PERMISSIONS.BRANCH_VIEW), getChildBranchController);
router.get("/:id", hasPermission(PERMISSIONS.BRANCH_VIEW), getBranchByIdController);
router.post("/", hasPermission(PERMISSIONS.BRANCH_CREATE), addBranchController);
router.put("/", hasPermission(PERMISSIONS.BRANCH_UPDATE), editBranchesController);
router.delete("/block", hasPermission(PERMISSIONS.BRANCH_BLOCK), blockBranchController);
router.patch("/unblock", hasPermission(PERMISSIONS.BRANCH_UNBLOCK), unblockBranchController);
router.delete("/:id", hasPermission(PERMISSIONS.BRANCH_DELETE), deleteBranchController);

export default router;
