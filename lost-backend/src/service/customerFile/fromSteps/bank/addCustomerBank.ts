import { Types } from 'mongoose';
import { EmployeeSchema } from '../../../../schema';
import customerFileSchema from '../../../../schema/customerFile';
import { ERROR, STEPS_NAMES } from '../../../../shared/enums';
import CustomerFileStatusNotification from '../../../../socket/sendNotification';
const addCustomerBank = async ({
  id,
  body,
  loginUser,
}: {
  id: string;
  body: any;
  loginUser: any;
}) => {
  const customerFile = await customerFileSchema.findById(id);
  if (!customerFile) {
    throw ERROR.NOT_FOUND;
  }
  customerFile.hasCreditCard = body.hasCreditCard;
  if (body.hasCreditCard) {
    customerFile.creditCard = body.creditCard;
  }
  customerFile.bank = body.bank;
  customerFile.updatedBy = new Types.ObjectId(loginUser.employeeId);
  customerFile.updatedAt = new Date();
  if (!customerFile.stepsDone.includes(STEPS_NAMES.BANK)) {
    customerFile.stepsDone.push(STEPS_NAMES.BANK);
  }
  const loginUserDetails = await EmployeeSchema.findOne({
    _id: new Types.ObjectId(loginUser.employeeId),
  });
  if (!loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }
  await customerFile.save();
  if (customerFile.status !== 'Pending') {
    CustomerFileStatusNotification({
      loanApplicationNumber: customerFile.loanApplicationNumber,
      creator: customerFile.createdBy,
      customerFileId: customerFile._id,
      updater: loginUser,
      message: {
        message: `${loginUserDetails.firstName + ' ' + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has updated bank details of the file`,
        title: `File FI-${customerFile.loanApplicationNumber} Bank details is updated `,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default addCustomerBank;
