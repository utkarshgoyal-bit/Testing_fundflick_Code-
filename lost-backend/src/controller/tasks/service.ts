import { Request, Response } from 'express';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { ServiceService } from '../../service/index';
import { ERROR, StatusCodes, SUCCESS } from '../../shared/enums';

class ServiceController {
  async getServices(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const { page } = req.query;
      const tasksData = await ServiceService.getServices({
        loginUser,
        page: Number(page),
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData?.data,
        'Services ' + SUCCESS.FETCHED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async getServicesById(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const { id } = req.params;
      const tasksData = await ServiceService.getServiceById({
        loginUser,
        id,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData,
        'Services ' + SUCCESS.FETCHED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async addService(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await ServiceService.addService({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Service ' + SUCCESS.CREATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async updateService(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await ServiceService.updateService({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Service ' + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await ServiceService.deleteService({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Service ' + SUCCESS.DELETED);
    } catch (_error) {
      const error = _error as { error: string; linkedClients?: { _id: string; name: string }[] };
      ApiResponseHandler.sendErrorResponse(
        res,
        error.error,
        ERROR.BAD_REQUEST,
        false,
        StatusCodes.Conflict,
        error?.linkedClients
      );
    }
  }
}

export default new ServiceController();
