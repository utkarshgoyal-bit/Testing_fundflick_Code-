import { LoginUser } from '../../../interfaces';
import CollectionModel from '../../../schema/collection/dataModel';
const flagCase = async ({
  caseNo,
  isFlagged,
  flagRemark,
  loginUser,
}: {
  caseNo: string;
  isFlagged: boolean;
  flagRemark: string;
  loginUser: LoginUser;
}) => {
  const data = await CollectionModel.findOneAndUpdate(
    { caseNo, organization: loginUser.organization._id },
    {
      isFlagged,
      flagRemark,
    },
    {
      new: true,
      upsert: false,
    }
  );
  if (!data) {
    throw new Error('Case not found');
  }
  return true;
};
export default flagCase;
