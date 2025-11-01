import { Types } from 'mongoose';
import CollectionModel from '../../../schema/collection/dataModel';
const assignedCase = async ({
  userId,
  caseNo,
  loginUser,
}: {
  userId: string;
  caseNo: string;
  loginUser: any;
}) => {
  const data = await CollectionModel.findOneAndUpdate(
    { caseNo, organization: loginUser.organization._id },
    { assignedTo: new Types.ObjectId(userId) },
    {
      new: true,
      upsert: false,
    }
  );
  if (!data) {
    throw new Error('Case not found');
  } else {
    return true;
  }
};

export default assignedCase;
