import { Types } from "mongoose";
import { checkPassword, encrypt } from "../../helper/encrypt";
import { User } from "../../interfaces/user.interface";
import UserSchema from "../../models/auth";
import { ERROR } from "../../shared/enums";

const updatePassword = async ({
  body,
  loginUser,
}: {
  body: {
    oldPassword: string;
    newPassword: string;
  };
  loginUser: User;
}) => {
  const user = await UserSchema.findOne({
    employeeId: new Types.ObjectId(loginUser.employeeId),
  });
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

export default updatePassword;
