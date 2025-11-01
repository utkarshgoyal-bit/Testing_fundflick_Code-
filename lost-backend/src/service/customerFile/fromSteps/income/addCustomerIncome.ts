import { Types } from 'mongoose';
import { EmployeeSchema } from '../../../../schema';
import customerFileSchema from '../../../../schema/customerFile';
import { ERROR, STEPS_NAMES } from '../../../../shared/enums';
import CustomerFileStatusNotification from '../../../../socket/sendNotification';
const addCustomerIncome = async ({
  body,
  id,
  loginUser,
}: {
  body: any;
  id: string;
  loginUser: any;
}) => {
  // Find and update the `customerFileSchema` document
  const customerFile = await customerFileSchema.findOne({
    _id: new Types.ObjectId(id),
    organization: loginUser.organization._id,
  });
  if (!customerFile) {
    throw ERROR.NOT_FOUND;
  }
  customerFile.customerOtherInformation = body.customerOtherInformation;
  customerFile.customerEmploymentDetails = body.customerEmploymentDetails;
  customerFile.customerOtherFamilyDetails = body.customerOtherFamilyDetails;
  customerFile.updatedBy = new Types.ObjectId(loginUser.employeeId);
  customerFile.updatedAt = new Date();
  if (!customerFile.stepsDone.includes(STEPS_NAMES.INCOME)) {
    customerFile.stepsDone.push(STEPS_NAMES.INCOME);
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
        message: `${loginUserDetails.firstName + ' ' + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has updated income details of the file`,
        title: `File FI-${customerFile.loanApplicationNumber} income details is updated `,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default addCustomerIncome;
