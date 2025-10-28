import express, { Express } from "express";
import { customerAssociatesController } from "../../../controller";
import { upload } from "../../../middleware/fileUpload";


const router: Express = express();
router.post("/:id", upload.any(), customerAssociatesController.addCustomerAssociate);
router.put('/:id',upload.any(), customerAssociatesController.editCustomerAssociate);
router.get("/:id", customerAssociatesController.getCustomerAssociates);
export default router;
