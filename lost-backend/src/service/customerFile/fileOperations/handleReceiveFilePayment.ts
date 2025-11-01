import { Types } from 'mongoose';
import { EmployeeSchema, UserSchema } from '../../../schema';
import CustomerFileSchema from '../../../schema/customerFile';
import { ERROR } from '../../../shared/enums';
import CustomerFileStatusNotification from '../../../socket/sendNotification';

const handleReceiveFilePayment = async ({ data, loginUser }: { data: any; loginUser: any }) => {
  const customerFile = await CustomerFileSchema.findOneAndUpdate(
    { loanApplicationNumber: data.loanApplicationNumber, organization: loginUser.organization._id },
    { loanApplicationFilePayment: data },
    { new: true, upsert: false }
  );

  if (!customerFile) {
    throw ERROR.USER_NOT_FOUND;
  }

  const user = await UserSchema.findOne({
    _id: new Types.ObjectId(loginUser._id),
    organization: loginUser.organization._id,
  });
  if (!user) {
    throw ERROR.USER_NOT_FOUND;
  }
  user.ledgerBalance = user.ledgerBalance + data.amount;
  user.ledgerBalanceHistory.push({
    date: new Date(),
    ledgerBalance: data.amount,
    type: 'debit',
    remarks: `Rs. ${data.amount} received for file no ${data.loanApplicationNumber}`,
  });
  await user.save();
  const loginUserDetails = await EmployeeSchema.findOne({
    _id: new Types.ObjectId(loginUser.employeeId),
    organization: loginUser.organization._id,
  });
  if (!loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }

  CustomerFileStatusNotification({
    loanApplicationNumber: customerFile.loanApplicationNumber,
    creator: customerFile.createdBy,
    customerFileId: customerFile._id,
    updater: loginUser,
    message: {
      message: `Rs. ${data.amount} received by ${loginUserDetails.firstName + ' ' + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role})`,
      title: `FI-${customerFile.loanApplicationNumber}  payment received`,
    },
    organization: loginUser.organization._id,
  });
  return true;
};

export default handleReceiveFilePayment;
