import { Types } from 'mongoose';
import UserSchema from '../../schema/auth';
const unblockUser = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const isUpdated = await UserSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(id), organizations: loginUser.organization._id },
    { isActive: true },
    {
      new: true,
      upsert: false,
    }
  );
  if (!isUpdated) {
    throw 'User not found';
  }
  return isUpdated;
};

export default unblockUser;
