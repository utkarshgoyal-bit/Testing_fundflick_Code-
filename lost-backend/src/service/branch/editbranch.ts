import { Types } from "mongoose";
import { EditBranchReqType } from "../../controller/branches/validations";
import BranchSchema from "../../models/branches";

const editBranch = async (body: EditBranchReqType, loginUser: any) => {
  const updatedBranch = await BranchSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(body.id), organization: loginUser.organization._id },
    body,
    {
      new: true,
      upsert: false,
    }
  );

  if (!updatedBranch) {
    throw new Error("Branch not found");
  }
  if (body.parentBranch) {
    const parentBranch = await BranchSchema.findOne({ _id: new Types.ObjectId(body.parentBranch) });
    if (parentBranch) {
      let setOfBranches = new Set(parentBranch.children);
      setOfBranches.add(updatedBranch._id);
      parentBranch.children = Array.from(setOfBranches);
      await parentBranch.save();
    }
  }

  return updatedBranch;
};
export default editBranch;
