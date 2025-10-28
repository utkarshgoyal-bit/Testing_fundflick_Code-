import { checkPassword } from "../../helper/encrypt";
import { User } from "../../interfaces/user.interface";
import Logger from "../../lib/logger";
import { generateToken } from "../../lib/token";
import UserSchema from "../../models/auth";
import EmployeeSchema from "../../models/employee";
import { ERROR, STATUS, STATUS_CODE, SUCCESS } from "../../shared/enums";

const login = async (payload: User) => {
  const employee = await EmployeeSchema.findOne({ email: payload.email });
  if (employee) {
    const user: User | null = await UserSchema.findOne<User>({
      employeeId: employee._id,
    }).populate<{ organizations: any }>(["roleRef", "organizations"]);
    const payloadPassword = payload.password;
    if (user) {
      const isPasswordMatched = await checkPassword(payloadPassword, user.password);
      if (!user?.isActive || user?.organizations[0]?.status !== STATUS.ACTIVE) {
        Logger.error("MODEL:LOGIN:DEACTIVATED", ERROR.USER_DEACTIVATED);
        throw ERROR.USER_DEACTIVATED;
      }
      if (isPasswordMatched) {
        const token = await generateToken({ user, email: payload.email });
        const userInfo = [user].map(({ employeeId, email, role, branches, loggedIn, loggedFrom, isActive, _id }) => ({
          employeeId,
          email,
          role,
          branches,
          loggedIn,
          loggedFrom,
          isActive,
          _id,
        }));
        console.log("userInfo", {
          browser: payload.browser,
          os: payload.os,
          lastLogin: payload.loggedIn,
          loggedFrom: payload.loggedFrom,
        });
        await UserSchema.updateOne({
          browser: payload.browser,
          os: payload.os,
          loggedIn: payload.loggedIn,
          updatedAt: payload.updatedAt,
        });
        return {
          user: userInfo,
          organizations: user.organizations.map(({ name, _id, status, isActive, id }) => ({
            name,
            _id,
            status,
            isActive,
            id,
          })),
          employment: employee,
          token,
          status: STATUS_CODE["200"],
          message: SUCCESS.LOGIN_SUCCESS,
          errorStatus: false,
          error: "",
        };
      } else {
        Logger.error("MODEL:LOGIN:INVALID_CREDENTIALS", ERROR.INVALID_CREDENTIALS);
        throw ERROR.INVALID_CREDENTIALS;
      }
    } else {
      Logger.error("MODEL:LOGIN:USER_NOT_FOUND", ERROR.USER_NOT_FOUND);
      throw ERROR.USER_NOT_FOUND;
    }
  } else {
    Logger.error("MODEL:LOGIN:USER_NOT_FOUND", ERROR.USER_NOT_FOUND);
    throw ERROR.USER_NOT_FOUND;
  }
};

export default login;
