/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { Types } from 'mongoose';
import Logger from '../../lib/logger';
import { getToken } from '../../lib/token';
import { EmployeeSchema, UserSchema } from '../../schema';
import { ERROR, STATUS, STATUS_CODE } from '../../shared/enums';
declare global {
  namespace Express {
    interface Request {
      loginUser?: any;
      employee?: any;
    }
  }
}
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const secret_key = process.env.JWT_SECRET || '';
  const activeOrganizationId: string | undefined = req.headers?.organization as string;
  const isUserCheck = req.originalUrl === '/user/details';
  const isNotValidOrganizationId = !Types.ObjectId.isValid(activeOrganizationId);
  if (isNotValidOrganizationId && !isUserCheck) {
    return res.status(406).json({
      message: ERROR.UNAUTHORIZED,
      error: '',
      status: STATUS_CODE['406'],
    });
  }
  const token = getToken(req);
  const isToken = !!token;
  if (!isToken) {
    return res.status(401).json({
      message: ERROR.TOKEN_NOT_FOUND,
      error: ERROR.TOKEN_NOT_FOUND,
      status: STATUS_CODE['401'],
    });
  }
  if (token) {
    jsonwebtoken.verify(token, secret_key, async (err, decoded: any) => {
      const { name: errorName } = err || {};
      if (errorName === 'TokenExpiredError') {
        Logger.error('TOKEN EXPIRED', err);
        return res.status(401).json({
          message: ERROR.TOKEN_EXPIRED,
          error: ERROR.TOKEN_EXPIRED,
          status: STATUS_CODE['401'],
        });
      }
      const user: any = await UserSchema.findById(decoded?._id).populate<{
        roleRef: any;
        organizations: any;
      }>(['roleRef', 'organizations']);
      const { employeeId, organizations } = user || {};
      if (!user) {
        return res.status(400).json({
          message: ERROR.USER_NOT_FOUND,
          error: ERROR.USER_NOT_FOUND,
          status: STATUS_CODE['400'],
        });
      }

      const employee = await EmployeeSchema.findById(employeeId).where({
        MONGO_DELETED: false,
      });
      if (isUserCheck) {
        if (!employee) {
          return res.status(401).json({
            message: ERROR.EMPLOYEE_NOT_FOUND,
            error: ERROR.EMPLOYEE_NOT_FOUND,
            status: STATUS_CODE['400'],
          });
        } else {
          req.loginUser = user;
          req.employee = employee;
          return next();
        }
      }
      const organization = organizations.find(
        (org: { _id: string; isActive: boolean; status: string }) =>
          org._id.toString() === activeOrganizationId
      );
      if ((organization && !organization?.isActive) || organization?.status !== STATUS.ACTIVE) {
        return res.status(400).json({
          message: ERROR.ORGANIZATION_NOT_FOUND,
          error: ERROR.ORGANIZATION_NOT_FOUND,
          status: STATUS_CODE['400'],
        });
      }

      if (user) {
        user.organization = organization || {};
        req.loginUser = user;
        req.employee = employee;
        return next();
      }
    });
  }
};
export default verifyToken;
