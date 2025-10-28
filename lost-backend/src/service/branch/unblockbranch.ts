import { Types } from "mongoose";
import BranchSchema from "../../models/branches";

const unblockBranch = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const isUpdated = await BranchSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(id), organization: loginUser.organization._id },
    { isActive: true },
    {
      new: true,
      upsert: false,
    }
  );
  if (!isUpdated) {
    throw "Branch not found";
  }
  return isUpdated;
};
export default unblockBranch;
