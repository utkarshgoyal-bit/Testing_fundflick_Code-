import express, { Express } from 'express';
import { upload } from '../../../middleware/fileUpload';
import { CustomerDetailsFileController } from '../../../controller';
const router: Express = express();
router.post(
  '/',
  upload.fields([{ name: 'customerDetails[uidBack]' }, { name: 'customerDetails[uidFront]' }]),
  CustomerDetailsFileController.addCustomerDetailsFile
);
router.put(
  '/:id',
  upload.fields([{ name: 'customerDetails[uidBack]' }, { name: 'customerDetails[uidFront]' }]),
  CustomerDetailsFileController.editCustomerDetailsFile
);
router.get('/:id', CustomerDetailsFileController.getCustomerDetailsFile);
export default router;
