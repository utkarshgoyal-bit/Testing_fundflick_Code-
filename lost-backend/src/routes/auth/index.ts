import express, { Express } from 'express';
import AuthController from '../../controller/auth';
import { verifyToken } from '../../middleware';
import { ROUTES } from '../../shared/enums';

const router: Express = express();

router.post(ROUTES.LOGIN, AuthController.login);
router.use(verifyToken);
router.post(ROUTES.FORGOT_PASSWORD, AuthController.forgotPassword);
router.get(ROUTES.LOGOUT, AuthController.logout);

export default router;
