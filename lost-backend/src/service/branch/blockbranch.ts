import { Types } from 'mongoose';
import BranchSchema from '../../schema/branches';

const blockBranch = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const isUpdated = await BranchSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(id), organization: loginUser.organization._id },
    { isActive: false },
    {
      new: true,
      upsert: false,
    }
  );
  if (!isUpdated) {
    throw 'Branch not found';
  }
  return isUpdated;
};
export default blockBranch;
