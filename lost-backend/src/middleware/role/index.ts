import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { Types } from 'mongoose';
import isSuperAdmin from '../../helper/booleanCheck/isSuperAdmin';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { User } from '../../interfaces/user.interface';
import Logger from '../../lib/logger';
import { getToken } from '../../lib/token';
import UserModel from '../../schema/auth';
import { ERROR } from '../../shared/enums';

const hasPermission = (permissionName?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await getToken(req);
      const decodeToken = jsonwebtoken.decode(token) as User;
      const { employeeId = '' } = decodeToken;
      const user = await UserModel.findOne({
        employeeId: new Types.ObjectId(employeeId),
      }).populate<{
        roleRef: { permissions: string[] };
      }>('roleRef');
      if (
        isSuperAdmin([user?.role || '']) ||
        (permissionName && user?.roleRef.permissions.includes(permissionName))
      ) {
        return next();
      } else {
        return ApiResponseHandler.sendErrorResponse(res, ERROR.INVALID_ROLE, ERROR.INVALID_ROLE);
      }
    } catch (_error) {
      const error = _error as Error;
      Logger.error(`Error: ${error?.message}`);
      return ApiResponseHandler.sendErrorResponse(
        res,
        ERROR.INTERNAL_SERVER_ERROR,
        ERROR.INTERNAL_SERVER_ERROR
      );
    }
  };
};

export default hasPermission;
