import { Request, Response } from 'express';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { DepartmentService } from '../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';

class DepartmentController {
  async getDepartment(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const { page } = req.query;
      const tasksData = await DepartmentService.getDepartments({
        loginUser,
        page: Number(page),
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData.data,
        'Departments ' + SUCCESS.FETCHED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async addDepartment(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await DepartmentService.addDepartment({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData,
        'Department ' + SUCCESS.CREATED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async updateDepartment(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await DepartmentService.updateDepartment({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData,
        'Department ' + SUCCESS.UPDATED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async deleteDepartment(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await DepartmentService.deleteDepartment({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData,
        'Department ' + SUCCESS.DELETED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(
        res,
        error,
        ERROR.BAD_REQUEST,
        false,
        StatusCodes.BadGateway
      );
    }
  }
}

export default new DepartmentController();
