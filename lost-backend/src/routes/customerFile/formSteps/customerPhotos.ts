import express, { Express } from 'express';
import { upload } from '../../../middleware/fileUpload';
import { CustomerPhotoController } from '../../../controller';
const router: Express = express();
router.post('/:id', upload.fields([{ name: 'photo' }]), CustomerPhotoController.addCustomerPhoto);
router.delete('/:id', CustomerPhotoController.deleteCustomerPhotos);
router.get('/:id', CustomerPhotoController.getCustomerPhotos);

export default router;
