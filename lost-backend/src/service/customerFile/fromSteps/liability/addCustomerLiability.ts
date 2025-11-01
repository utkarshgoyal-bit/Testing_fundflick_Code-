import { Types } from 'mongoose';
import { EmployeeSchema } from '../../../../schema';
import customerFileSchema from '../../../../schema/customerFile';
import { ERROR, STEPS_NAMES } from '../../../../shared/enums';
import CustomerFileStatusNotification from '../../../../socket/sendNotification';

const addCustomerLiability = async ({
  fileId,
  familyExpenses,
  loginUser,
}: {
  loginUser: any;
  familyExpenses: any;
  fileId: string;
}) => {
  const customerFile = await customerFileSchema.findOne({
    _id: new Types.ObjectId(fileId),
    organization: loginUser.organization._id,
  });
  if (!customerFile) {
    throw ERROR.USER_NOT_FOUND;
  }
  customerFile.familyExpenses = familyExpenses;
  customerFile.updatedBy = new Types.ObjectId(loginUser.employeeId);
  customerFile.updatedAt = new Date();
  if (!customerFile.stepsDone.includes(STEPS_NAMES.LIABILITY)) {
    customerFile.stepsDone.push(STEPS_NAMES.LIABILITY);
  }
  await customerFile.save();
  const loginUserDetails = await EmployeeSchema.findOne({
    _id: new Types.ObjectId(loginUser.employeeId),
    organization: loginUser.organization._id,
  });
  if (!loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }
  if (customerFile.status !== 'Pending') {
    CustomerFileStatusNotification({
      loanApplicationNumber: customerFile.loanApplicationNumber,
      creator: customerFile.createdBy,
      customerFileId: customerFile._id,
      updater: loginUser,
      message: {
        message: `${loginUserDetails.firstName + ' ' + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has updated liability details of the file`,
        title: `File FI-${customerFile.loanApplicationNumber} liability details is updated `,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default addCustomerLiability;
