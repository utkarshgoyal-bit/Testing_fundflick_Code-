import { Types } from 'mongoose';
import CollectionModel from '../../../../schema/collection/dataModel';
const deleteCaseRemark = async ({
  caseNo,
  remarkId,
  loginUser,
}: {
  caseNo: string;
  remarkId: string;
  loginUser: any;
}) => {
  if (!caseNo) {
    throw new Error('Case number is required');
  }
  const data = await CollectionModel.findOneAndUpdate(
    { caseNo, organization: loginUser.organization._id },
    { $pull: { remarks: { _id: new Types.ObjectId(remarkId) } } },
    { new: true, upsert: false }
  );
  if (!data) {
    throw new Error('Case not found');
  }
  return true;
};
export default deleteCaseRemark;
