import moment from 'moment';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { encrypt } from '../../helper/encrypt';
import { ErrorModel } from '../../interfaces/index';
import { User } from '../../interfaces/user.interface';
import Logger from '../../lib/logger';
import UserSchema from '../../models/auth';
import { COMPONENTS, ERROR, STATUS_CODE, SUCCESS } from '../../shared/enums';

const signUp = async (payload: User) => {
  let result = [];
  if (payload.password) {
    const encryptedPassword = await encrypt(payload.password);
    const upsertPayload: User = {
      ...payload,
      loggedIn: payload.loggedIn || moment().unix(),
      loggedFrom: payload.loggedFrom || 'platform:' + os.platform() + ' ' + 'hostname:' + os.hostname(),
      password: encryptedPassword,
      isActive: payload.isActive || false,
      createdAt: moment().unix(),
      updatedAt: payload.updatedAt || moment().unix(),
      userId: uuidv4(),
    };
    result = (await UserSchema.insertMany([upsertPayload])) || [];
    if (result.length > 0) {
      const error: ErrorModel = {
        message: COMPONENTS.USER + SUCCESS.CREATED,
        errorStatus: false,
        error: '',
        status: STATUS_CODE['200'],
      };
      throw error;
    }
  } else {
    Logger.error('MODEL:SIGNUP:PASSWORD_CANNOT_BE_EMPTY', ERROR.PASSWORD_CANNOT_BE_EMPTY);
    const error: ErrorModel = {
      message: ERROR.PASSWORD_CANNOT_BE_EMPTY,
      errorStatus: true,
      error: '',
      status: STATUS_CODE['400'],
    };
    throw error;
  }
  Logger.error('MODEL:SIGNUP:USER_CANNOT_BE_CREATED', ERROR.USER_CANNOT_BE_CREATED, result);
  const error: ErrorModel = {
    errorStatus: true,
    error: '',
    message: ERROR.USER_CANNOT_BE_CREATED,
    status: STATUS_CODE['400'],
  };
  throw error;
};

export default signUp;
