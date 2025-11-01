import express, { Express } from 'express';
import { TeleVerificationController } from '../../controller';
import { hasPermission } from '../../middleware';
import { PERMISSIONS } from '../../shared/enums/permissions';
const router: Express = express();
router.get(
  '/',
  hasPermission(PERMISSIONS.TELEPHONE_QUESTION_VIEW),
  TeleVerificationController.getTelephoneQuestion
);
router.get(
  '/:id',
  hasPermission(PERMISSIONS.TELEPHONE_QUESTION_VIEW),
  TeleVerificationController.getTelephoneQuestionById
);
router.post(
  '/',
  hasPermission(PERMISSIONS.TELEPHONE_QUESTION_CREATE),
  TeleVerificationController.addTelephoneQuestion
);
router.put(
  '/',
  hasPermission(PERMISSIONS.TELEPHONE_QUESTION_UPDATE),
  TeleVerificationController.editTelephoneQuestion
);
router.delete(
  '/',
  hasPermission(PERMISSIONS.TELEPHONE_QUESTION_DELETE),
  TeleVerificationController.deleteTelephoneQuestion
);
export default router;
