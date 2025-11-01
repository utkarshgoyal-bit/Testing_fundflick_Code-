import { Request, Response } from 'express';
import { ApiResponseHandler } from '../../helper/responseHelper';
import FileControllers from '../../service/customerFile/main';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';
class CustomerFileController {
  async getCustomerFiles(req: Request, res: Response) {
    try {
      const response = await FileControllers.getFiles({
        loginUser: req.loginUser,
        filters: req.query,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        response,
        'Customer File ' + SUCCESS.CREATED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async getCustomerFilesById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const response = await FileControllers.getFileById({ id, loginUser: req.loginUser });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        response,
        'Customer File ' + SUCCESS.CREATED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
}

export default new CustomerFileController();
