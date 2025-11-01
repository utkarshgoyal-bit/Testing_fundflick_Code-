import { Request, Response } from 'express';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { PendencyServices } from '../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';

class PendencyController {
  async getPendency(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const { active, fileId } = req.query;
      const pendencyData = await PendencyServices.getPendency({
        loginUser,
        active: active === 'true' ? true : false,
        fileId: fileId as string,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        pendencyData,
        'Pendency ' + SUCCESS.FETCHED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async createPendency(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const pendencyData = await PendencyServices.createPendency({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        pendencyData,
        'Pendency ' + SUCCESS.CREATED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async updatePendency(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const pendencyData = await PendencyServices.updatePendency({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        pendencyData,
        'Pendency ' + SUCCESS.UPDATED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async deletePendency(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const pendencyData = await PendencyServices.deletePendency({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        pendencyData,
        'Pendency ' + SUCCESS.DELETED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async markCompleted(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const pendencyData = await PendencyServices.markCompleted({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, pendencyData, 'Success ');
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async reActivate(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const pendencyData = await PendencyServices.reActivate({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, pendencyData, 'Success ');
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
}

export default new PendencyController();
