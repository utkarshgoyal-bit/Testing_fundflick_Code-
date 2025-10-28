import express, { Express } from "express";
import { CustomerIncomeController } from "../../../controller";

const router: Express = express();
router.post("/:id", CustomerIncomeController.addCustomerIncomes);
router.get("/:id", CustomerIncomeController.getCustomerIncomes);
export default router;
