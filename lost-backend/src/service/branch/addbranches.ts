import { Types } from 'mongoose';
import { AddBranchReqType } from '../../controller/branches/validations';
import BranchSchema from '../../schema/branches';
import { COMPONENTS, ERROR } from '../../shared/enums';

const addBranch = async ({
  body,
  loginUser,
}: {
  body: AddBranchReqType & { organization?: Types.ObjectId; createdBy?: Types.ObjectId };
  loginUser: any;
}) => {
  const isExist = await BranchSchema.findOne({
    name: body.name,
    organization: loginUser.organization._id,
  });
  if (isExist) {
    throw COMPONENTS.BRANCH + ERROR.ALREADY_EXISTS;
  }
  body.createdBy = loginUser.employeeId;
  body.organization = loginUser.organization._id;
  const branch = new BranchSchema(body);
  await branch.save();
  if (body.parentBranch) {
    const parentBranch = await BranchSchema.findOne({ _id: new Types.ObjectId(body.parentBranch) });
    if (parentBranch) {
      const setOfBranches = new Set(parentBranch.children);
      setOfBranches.add(branch._id);
      parentBranch.children = Array.from(setOfBranches);
      await parentBranch.save();
    }
  }
  return branch;
};
export default addBranch;
