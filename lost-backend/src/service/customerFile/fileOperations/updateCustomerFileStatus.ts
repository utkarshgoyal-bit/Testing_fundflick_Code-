import { Types } from 'mongoose';
import { FILE_STATUS } from '../../../enums/file.enum';
import { EmployeeSchema } from '../../../schema';
import CustomerFileSchema from '../../../schema/customerFile';
import { ERROR } from '../../../shared/enums';
import CustomerFileStatusNotification from '../../../socket/sendNotification';

const updateCustomerFileStatus = async ({
  loanApplicationNumber,
  status,
  loginUser,
  data,
}: {
  loanApplicationNumber: string;
  status: string;
  loginUser: any;
  data: any;
}) => {
  if (!loginUser) {
    throw ERROR.USER_NOT_FOUND;
  }
  const loginUserDetails = await EmployeeSchema.findOne({
    _id: new Types.ObjectId(loginUser.employeeId),
    organization: loginUser.organization._id,
  });
  if (!loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }
  if (status == FILE_STATUS.REVIEW) {
    const customerFile = await CustomerFileSchema.findOneAndUpdate(
      { loanApplicationNumber, organization: loginUser.organization._id },
      { status, salesManReport: data },
      { new: true, upsert: false }
    );
    if (!customerFile) {
      throw ERROR.USER_NOT_FOUND;
    }
    CustomerFileStatusNotification({
      loanApplicationNumber: customerFile.loanApplicationNumber,
      creator: customerFile.createdBy,
      customerFileId: customerFile._id,
      updater: loginUser,
      message: {
        message: `${
          loginUserDetails.firstName + ' ' + loginUserDetails.lastName
        }(${loginUser.roleRef?.name || loginUser.role}) has send for reviewed the customer file`,
        title: `File FI-${loanApplicationNumber} status updated to ${status.toLocaleLowerCase()}`,
      },
      organization: loginUser.organization._id,
    });
  }
  if (status == FILE_STATUS.APPROVED || status == FILE_STATUS.REJECTED) {
    const customerFile = await CustomerFileSchema.findOne({
      loanApplicationNumber,
      organization: loginUser.organization._id,
    });
    if (!customerFile) {
      throw ERROR.USER_NOT_FOUND;
    }
    if (
      customerFile.status === FILE_STATUS.APPROVED ||
      customerFile.status === FILE_STATUS.REJECTED
    ) {
      throw ERROR.INVALID_OPERATION;
    }
    customerFile.status = status;
    if (data) {
      customerFile.finalApproveReport = data;
    }
    customerFile.approveOrRejectRemarks = data.approveOrRejectRemarks;
    customerFile.approvedOrRejectedBy = new Types.ObjectId(loginUser.employeeId);
    await customerFile.save();
    CustomerFileStatusNotification({
      loanApplicationNumber: customerFile.loanApplicationNumber,
      creator: customerFile.createdBy,
      customerFileId: customerFile._id,
      updater: loginUser,
      message: {
        message: `${loginUserDetails.firstName + ' ' + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has reviewed the customer file`,
        title: `File FI-${loanApplicationNumber} status updated to ${status.toLocaleLowerCase()},${
          status == FILE_STATUS.APPROVED ? 'Please  collect file payment' : ''
        }`,
      },
      organization: loginUser.organization._id,
    });
  }
  if (status == FILE_STATUS.TASK_PENDING) {
    const customer = await CustomerFileSchema.findOne({
      loanApplicationNumber,
      organization: loginUser.organization._id,
    });
    if (!customer) {
      throw ERROR.USER_NOT_FOUND;
    }
    if (customer.status === FILE_STATUS.APPROVED || customer.status === FILE_STATUS.REJECTED) {
      throw ERROR.INVALID_OPERATION;
    }
    customer.status = status;
    await customer.save();
    CustomerFileStatusNotification({
      loanApplicationNumber: customer.loanApplicationNumber,
      creator: customer.createdBy,
      customerFileId: customer._id,
      updater: loginUser,
      message: {
        message: `${loginUserDetails.firstName + ' ' + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has reviewed the customer file`,
        title: `File FI-${loanApplicationNumber} status updated to ${status.toLocaleLowerCase()}`,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default updateCustomerFileStatus;
