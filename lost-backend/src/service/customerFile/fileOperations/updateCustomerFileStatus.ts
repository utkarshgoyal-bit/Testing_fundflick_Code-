import { Types } from "mongoose";
import { User } from "../../../interfaces/user.interface";
import { EmployeeSchema } from "../../../models";
import CustomerFileSchema from "../../../models/customerFile";
import { ERROR } from "../../../shared/enums";
import CustomerFileStatusNotification from "../../../socket/sendNotification";

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
  if (status == "Review") {
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
          loginUserDetails.firstName + " " + loginUserDetails.lastName
        }(${loginUser.roleRef?.name || loginUser.role}) has send for reviewed the customer file`,
        title: `File FI-${loanApplicationNumber} status updated to ${status.toLocaleLowerCase()}`,
      },
      organization: loginUser.organization._id,
    });
  }
  if (status == "Approved" || status == "Rejected") {
    const customerFile = await CustomerFileSchema.findOne({
      loanApplicationNumber,
      organization: loginUser.organization._id,
    });
    if (!customerFile) {
      throw ERROR.USER_NOT_FOUND;
    }
    if (customerFile.status === "Approved" || customerFile.status === "Rejected") {
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
        message: `${loginUserDetails.firstName + " " + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has reviewed the customer file`,
        title: `File FI-${loanApplicationNumber} status updated to ${status.toLocaleLowerCase()},${
          status == "Approved" ? "Please  collect file payment" : ""
        }`,
      },
      organization: loginUser.organization._id,
    });
  }
  if (status == "Task Pending") {
    const customer = await CustomerFileSchema.findOne({
      loanApplicationNumber,
      organization: loginUser.organization._id,
    });
    if (!customer) {
      throw ERROR.USER_NOT_FOUND;
    }
    if (customer.status === "Approved" || customer.status === "Rejected") {
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
        message: `${loginUserDetails.firstName + " " + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has reviewed the customer file`,
        title: `File FI-${loanApplicationNumber} status updated to ${status.toLocaleLowerCase()}`,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default updateCustomerFileStatus;
