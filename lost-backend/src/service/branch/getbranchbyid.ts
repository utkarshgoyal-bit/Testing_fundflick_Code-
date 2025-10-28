import { Types } from "mongoose";
import BranchSchema from "../../models/branches";

const getBranchById = async (id: string, loginUser: any) => {
  const branch = await BranchSchema.findOne({
    _id: new Types.ObjectId(id),
    organization: loginUser.organization._id,
  });
  if (!branch) throw "Branch not found";
  return branch;
};
export default getBranchById;
