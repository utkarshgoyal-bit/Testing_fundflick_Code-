import express, { Express } from 'express';
import { CreditController } from '../../controller/index';
import { hasPermission } from '../../middleware';
import { PERMISSIONS } from '../../shared/enums/permissions';
const router: Express = express();

router.get(
  '/personal',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.getCreditPersonalDetails
);
router.get(
  '/family',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.getCreditFamilyDetails
);
router.get(
  '/property',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.getCreditPropertyDetails
);

router.post(
  '/income/:fileId',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.addCreditIncomeDetails
);
router.get(
  '/income/:fileId',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.getCreditIncomeDetails
);
router.delete(
  '/income/:fileId',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.deleteCreditIncomeDetails
);
router.put(
  '/income/:fileId',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.editCreditIncomeDetails
);

router.get(
  '/liability/:fileId',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.getCreditLiabilityDetails
);
router.post(
  '/liability/:fileId',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.addCreditLiabilityDetails
);
router.delete(
  '/liability/:fileId',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.deleteCreditLiabilityDetails
);
router.put(
  '/liability/:fileId',
  hasPermission(PERMISSIONS.CREDIT_VIEW),
  CreditController.editCreditLiabilityDetails
);

router.post(
  '/personal',
  hasPermission(PERMISSIONS.CREDIT_UPDATE),
  CreditController.updateCreditPersonalDetails
);
router.post(
  '/family',
  hasPermission(PERMISSIONS.CREDIT_UPDATE),
  CreditController.updateCreditFamilyDetails
);
router.post(
  '/property',
  hasPermission(PERMISSIONS.CREDIT_UPDATE),
  CreditController.updateCreditPropertyDetails
);

export default router;
