import express, { Express } from "express";
import { UsersController } from "../../controller/index";
import { hasPermission } from "../../middleware";
import { PERMISSIONS } from "../../shared/enums/permissions";
const router: Express = express();
router.get("/details", UsersController.getUserDetails);
router.get("/", hasPermission(PERMISSIONS.USER_VIEW), UsersController.getUser);
router.get("/:id", hasPermission(PERMISSIONS.USER_VIEW), UsersController.getUserById);
router.post("/", hasPermission(PERMISSIONS.USER_CREATE), UsersController.addUser);
router.put("/", hasPermission(PERMISSIONS.USER_UPDATE), UsersController.editUser);
router.delete("/block", hasPermission(PERMISSIONS.USER_DELETE), UsersController.blockUser);
router.patch("/unblock", hasPermission(PERMISSIONS.USER_DELETE), UsersController.unblockUser);
router.post("/receiveLedgerBalance", UsersController.receiveLedgerBalance);
router.post("/fcm-token", UsersController.saveFcmToken);

export default router;
