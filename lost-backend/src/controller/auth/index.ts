import { Request, Response } from 'express';
import { isTrue } from '../../helper/booleanCheck';
import { ApiResponseHandler, StatusCodes } from '../../helper/responseHelper';
import { DbError } from '../../interfaces/user.interface';
import Logger from '../../lib/logger';
import { AuthServices } from '../../service/index';
import { ERROR, SUCCESS } from '../../shared/enums';
// import { COOKIE_OPTIONS } from "../..";
class AuthController {
  signUp = async (req: Request, res: Response) => {
    try {
      const result: any = await AuthServices.signUp(req.body);
      const { errorStatus, errors, message }: DbError = result;
      if (isTrue(errorStatus)) {
        if (isTrue(message.includes('duplicate'))) {
          Logger.error('CONTROLLER:SIGN UP EMAIL ERROR', errors);
          return res.status(409).json({
            status: 409,
            message: message || ERROR.BAD_REQUEST,
          });
        }
        Logger.error('CONTROLLER:SIGN UP ERROR', errors);
        return res.status(400).json({
          status: 400,
          message: message || ERROR.BAD_REQUEST,
        });
      }
      res.status(200).json({ result });
    } catch (error) {
      Logger.error('CONTROLLER:SIGN UP ERROR', error);
      res.status(500).json({ error });
    }
  };
  login = async (req: Request, res: Response) => {
    try {
      const result = await AuthServices.login(req.body);
      // res.cookie("token", result.token, COOKIE_OPTIONS);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, result, SUCCESS.LOGIN_SUCCESS);
    } catch (error) {
      Logger.error('CONTROLLER:LOGIN ERROR', error);
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { body, loginUser } = req;
      const result = await AuthServices.updatePassword({ body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, result, 'Password Reset  Successfully');
    } catch (error) {
      Logger.error('CONTROLLER:FORGOT PASSWORD ERROR', error);
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
  logout = async (req: Request, res: Response) => {
    // res.clearCookie("token", COOKIE_OPTIONS);
    res.status(200).json({ msg: 'Logged out' });
  };
}
export default new AuthController();
