import { Types } from 'mongoose';
import { EmployeeSchema } from '../../../schema';
import CustomerFileSchema from '../../../schema/customerFile';
import { ERROR } from '../../../shared/enums';
import CustomerFileStatusNotification from '../../../socket/sendNotification';

const updateFileComments = async ({
  loanApplicationNumber,
  loginUser,
  comments,
}: {
  loanApplicationNumber: string;
  loginUser: any;
  comments: any;
}) => {
  const customer = await CustomerFileSchema.findOneAndUpdate(
    { loanApplicationNumber, organization: loginUser.organization._id },
    { fileCommentsAndReplays: comments, fileCommentsReadStatus: false },
    { new: true, upsert: false }
  );
  if (!customer) {
    throw ERROR.USER_NOT_FOUND;
  }
  const loginUserDetails = await EmployeeSchema.findOne({
    _id: new Types.ObjectId(loginUser.employeeId),
  });
  if (!loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }
  CustomerFileStatusNotification({
    loanApplicationNumber: customer.loanApplicationNumber,
    creator: customer.createdBy,
    customerFileId: customer._id,
    updater: loginUser,
    message: {
      message: `${loginUserDetails.firstName + ' ' + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has added a  new comment  on file`,
      title: `New comment added on file no ${customer.loanApplicationNumber}`,
    },
    organization: loginUser.organization._id,
  });
  return true;
};
export default updateFileComments;
