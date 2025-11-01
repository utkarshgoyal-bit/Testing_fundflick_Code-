import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { isTrue } from '../../helper/booleanCheck';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { UsersServices } from '../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';
import addUserReqValidation from './validations';

class UsersController {
  getUsers = async (req: Request, res: Response) => {
    try {
      const { query: { isBlocked, branchName, other: isOther, isAllowSelfUser } = {}, loginUser } =
        req;
      let users = [];
      if (isOther) {
        users = await UsersServices.getUsers({
          loginUser,
          isBlocked: isBlocked as string,
          isAllowSelfUser: isTrue(isAllowSelfUser as string),
        });
      } else {
        users = await UsersServices.getUsers({
          loginUser,
          isBlocked: isBlocked as string,
          branchName: branchName as string,
          isAllowSelfUser: isTrue(isAllowSelfUser as string),
        });
      }
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, users, 'User ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
  getUserById = async (req: Request, res: Response) => {
    try {
      const loginUser = req.loginUser;
      const { params: { id = '' } = {} } = req;
      const users = await UsersServices.getUserById({ loginUser, id });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, users, 'User ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  addUser = async (req: Request, res: Response) => {
    try {
      const validatedReq = addUserReqValidation.parse(req.body);
      const user = await UsersServices.addUser({
        body: validatedReq,
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, user, 'User ' + SUCCESS.CREATED);
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponseHandler.sendErrorResponse(res, error.errors, ERROR.BAD_REQUEST);
      }
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  editUser = async (req: Request, res: Response) => {
    try {
      const validatedReq = addUserReqValidation.parse(req.body);
      const user = await UsersServices.editUser({ body: validatedReq, loginUser: req.loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, user, 'User ' + SUCCESS.UPDATED);
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponseHandler.sendErrorResponse(
          res,
          JSON.stringify(error.errors),
          ERROR.BAD_REQUEST
        );
      }
      ApiResponseHandler.sendErrorResponse(res, JSON.stringify(error), ERROR.BAD_REQUEST);
    }
  };

  blockUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const user = await UsersServices.blockUser({ id, loginUser: req.loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, user, 'User ' + SUCCESS.BLOCKED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  unblockUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const user = await UsersServices.unblockUser({ id, loginUser: req.loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, user, 'User ' + SUCCESS.UNBLOCKED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  receiveLedgerBalance = async (req: Request, res: Response) => {
    try {
      const user = await UsersServices.receiveLedgerBalance({
        body: req.body,
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, user, SUCCESS.RECEIVED_LEDGER_BALANCE);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
  saveFcmToken = async (req: Request, res: Response) => {
    try {
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, { success: true }, 'Ok');
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
  getUserDetails = async (req: Request, res: Response) => {
    try {
      const user = await UsersServices.getUserDetails({
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, user, 'Ok');
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
}

export default new UsersController();
