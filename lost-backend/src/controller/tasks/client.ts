import { Request, Response } from 'express';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { ClientService } from '../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';

class ClientController {
  async getClient(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const { page } = req.query;
      const tasksData = await ClientService.getClient({
        loginUser,
        page: Number(page),
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Clients ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const { id } = req.params;
      const tasksData = await ClientService.getClientById({
        loginUser,
        id,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async addClient(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await ClientService.addClient({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Client ' + SUCCESS.CREATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(
        res,
        error,
        ERROR.BAD_REQUEST,
        false,
        StatusCodes.BadRequest
      );
    }
  }

  async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await ClientService.updateClient({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Client ' + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await ClientService.deleteClient({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Client ' + SUCCESS.DELETED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
}

export default new ClientController();
