import express, { Express } from 'express';
import { upload } from '../../../middleware/fileUpload';
import { CustomerLiabilityController } from '../../../controller';
const router: Express = express();
router.post('/:id', CustomerLiabilityController.addCustomerLiability);
router.get('/:id', CustomerLiabilityController.getCustomerLiability);
router.post('/:id/existing-loans', upload.any(), CustomerLiabilityController.addExistingLoan);
router.put('/:id/existing-loans', upload.any(), CustomerLiabilityController.editExistingLoan);

export default router;
