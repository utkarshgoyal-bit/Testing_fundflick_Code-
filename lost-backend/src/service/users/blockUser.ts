import { Types } from "mongoose";
import UserSchema from "../../models/auth";
const blockUser = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const isUpdated = await UserSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(id), organizations: loginUser.organization._id },
    { isActive: false },
    {
      new: true,
      upsert: false,
    }
  );
  if (!isUpdated) {
    throw " User not found";
  }
  return isUpdated;
};

export default blockUser;
