import { Types } from "mongoose";
import UserSchema from "../../models/auth";

const saveFcmToken = async ({ token, loginUser }: { token: string; loginUser: any }) => {
  const user = await UserSchema.findOne({
    _id: new Types.ObjectId(loginUser._id),
    organizations: loginUser.organization._id,
  });
  if (user) {
    user.fcmToken = token;
    await user.save();
    return user;
  }
};

export default saveFcmToken;
