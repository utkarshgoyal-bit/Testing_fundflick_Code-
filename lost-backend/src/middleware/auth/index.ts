import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { isFalse } from "../../helper/booleanCheck";
import Logger from "../../lib/logger";
import { getToken } from "../../lib/token";
import { EmployeeSchema, UserSchema } from "../../models";
import { ERROR, STATUS, STATUS_CODE } from "../../shared/enums";
import { Types } from "mongoose";
declare global {
  namespace Express {
    interface Request {
      loginUser?: any;
      employee?: any;
    }
  }
}
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const secret_key = process.env.JWT_SECRET || "";
  const activeOrganizationId: string | undefined = req.headers?.organization as string;
  const isUserCheck = req.originalUrl === "/user/details";
  if (!Types.ObjectId.isValid(activeOrganizationId) && !isUserCheck) {
    return res.status(406).json({
      message: ERROR.UNAUTHORIZED,
      error: "",
      status: STATUS_CODE["406"],
    });
  }
  const token = getToken(req);
  if (isFalse(token)) {
    return res.status(401).json({
      message: ERROR.UNAUTHORIZED,
      error: "",
      status: STATUS_CODE["401"],
    });
  }
  if (token) {
    jsonwebtoken.verify(token, secret_key, async (err, decoded: any) => {
      const user: any = await UserSchema.findById(decoded?._id).populate<{ roleRef: any; organizations: any }>([
        "roleRef",
        "organizations",
      ]);

      const employee = await EmployeeSchema.findById(user?.employeeId);
      if (isUserCheck) {
        if (!user) {
          return res.status(401).json({
            message: ERROR.UNAUTHORIZED,
            error: "",
            status: STATUS_CODE["401"],
          });
        } else {
          req.loginUser = user;
          req.employee = employee;
          return next();
        }
      }
      const organization = user?.organizations.find((org: any) => org._id.toString() === activeOrganizationId);
      if ((organization && !organization?.isActive) || organization?.status !== STATUS.ACTIVE) {
        return res.status(401).json({
          message: ERROR.USER_DEACTIVATED,
          error: "",
          status: STATUS_CODE["404"],
        });
      }

      if (user) {
        user.organization = organization || {};
        req.loginUser = user;
        req.employee = employee;
      }
      if (err) {
        if (err.name === "TokenExpiredError") {
          Logger.error("TOKEN EXPIRED", err);
          return res.status(401).json({ message: "Token has expired" });
        } else {
          Logger.error("INVALID TOKEN", err);
          return res.status(401).json({ message: "Invalid token" });
        }
      } else {
        return next();
      }
    });
  }
};
export default verifyToken;
