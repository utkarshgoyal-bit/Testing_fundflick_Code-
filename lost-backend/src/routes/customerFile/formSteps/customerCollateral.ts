import express, { Express } from 'express';
import { CustomerCollateralController } from '../../../controller';
const router: Express = express();
router.post('/:id', CustomerCollateralController.addCustomerCollateral);
router.get('/:id', CustomerCollateralController.getCustomerCollateral);
export default router;
