import { Types } from 'mongoose';
import { checkPassword, encrypt } from '../../helper/encrypt';
import { LoginUser } from '../../interfaces';
import UserSchema from '../../schema/auth';
import { ERROR } from '../../shared/enums';

const forgotPassword = async ({
  body,
  loginUser,
}: {
  body: {
    oldPassword: string;
    newPassword: string;
  };
  loginUser: LoginUser;
}) => {
  const { employeeId } = loginUser;
  const user = await UserSchema.findOne({
    employeeId: new Types.ObjectId(employeeId),
  });
  if (!user) {
    throw ERROR.USER_NOT_FOUND;
  }
  if (!body.newPassword || !body.oldPassword) {
    throw ERROR.INVALID_CREDENTIALS;
  }
  if (user && user.password) {
    const isPasswordMatch = await checkPassword(body.oldPassword, user.password);
    if (isPasswordMatch) {
      const encryptedNewPassword = await encrypt(body.newPassword);
      user.password = encryptedNewPassword;
      await user.save();
      return true;
    } else {
      throw ERROR.INVALID_CREDENTIALS;
    }
  } else {
    return false;
  }
};

export default forgotPassword;
