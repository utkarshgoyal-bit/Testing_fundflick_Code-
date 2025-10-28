import express, { Express } from "express";
import { AuthController } from "../../controller/index";
import { ROUTES } from "../../shared/enums";
import { verifyToken } from "../../middleware";

const router: Express = express();

router.post(ROUTES.LOGIN, AuthController.login);
router.post(ROUTES.FORGOT_PASSWORD, verifyToken, AuthController.forgotPassword);
router.get(ROUTES.LOGOUT, AuthController.logout);

export default router;
