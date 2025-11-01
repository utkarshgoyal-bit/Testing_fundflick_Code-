import { Request, Response } from 'express';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { DashboardService } from '../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';

class DashboardController {
  getDashboard = async (req: Request, res: Response) => {
    try {
      const branches = await DashboardService.getDashboard({ loginUser: req.loginUser });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        branches,
        'Dashboard ' + SUCCESS.FETCHED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
}

export default new DashboardController();
