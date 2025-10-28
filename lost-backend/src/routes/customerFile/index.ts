import express, { Express } from 'express';
import { FileControllers, FileOperationsController } from '../../controller';
import fileOperationRoutes from './fileOperations';
import customerAddress from './formSteps/customerAddress';
import customerAssociate from './formSteps/customerAssociate';
import customerBank from './formSteps/customerBank';
import customerCollateral from './formSteps/customerCollateral';
import customerDetails from './formSteps/customerDetails';
import customerIncome from './formSteps/customerIncome';
import customerLiability from './formSteps/customerLiability';
import customerPhotos from './formSteps/customerPhotos';
const router: Express = express();

router.use('/customer_details', customerDetails);
router.use('/customer_address', customerAddress);
router.use('/customer_associates', customerAssociate);
router.use('/customer_income', customerIncome);
router.use('/customer_liability', customerLiability);
router.use('/customer_collateral', customerCollateral);
router.use('/customer_bank', customerBank);
router.use('/customer_photos', customerPhotos);

router.get('/', FileControllers.getCustomerFiles);
router.get('/:id', FileControllers.getCustomerFilesById);

//file operations

router.use('/file-operations', fileOperationRoutes);

export default router;
