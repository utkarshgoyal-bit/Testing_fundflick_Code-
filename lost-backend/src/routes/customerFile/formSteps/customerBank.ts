import express, { Express } from "express";
import { CustomerBankController } from "../../../controller";
const router: Express = express();
router.post("/:id", CustomerBankController.addCustomerBank);
router.get("/:id", CustomerBankController.getCustomerBank);
export default router;
