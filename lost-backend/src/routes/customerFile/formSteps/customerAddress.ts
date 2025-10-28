import express, { Express } from "express";
import { customerAddress } from "../../../controller";
const router: Express = express();

router.post("/:id", customerAddress.addCustomerAddress);
router.get('/:id', customerAddress.getCustomerAddress);
export default router;
