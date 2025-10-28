import { Types } from "mongoose";
import BranchSchema from "../../models/branches";

const deleteBranch = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const isUpdated = await BranchSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(id), organization: loginUser.organization._id },
    { IS_DELETED: true },
    {
      new: true,
      upsert: false,
    }
  ).lean();
  if (!isUpdated) {
    throw {
      error: {
        message: "Branch not found",
        statusCode: 404,
      },
    };
  }
  return true;
};
export default deleteBranch;
