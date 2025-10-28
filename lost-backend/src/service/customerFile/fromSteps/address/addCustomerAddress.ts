import { Types } from "mongoose";

import { User } from "../../../../interfaces/user.interface";
import { EmployeeSchema } from "../../../../models";
import customerFileSchema from "../../../../models/customerFile";
import { ERROR, STEPS_NAMES } from "../../../../shared/enums";
import CustomerFileStatusNotification from "../../../../socket/sendNotification";

const addCustomerAddress = async ({ body, fileId, loginUser }: { body: any; loginUser: any; fileId: string }) => {
  const customerFile = await customerFileSchema.findById(fileId);
  if (!customerFile) {
    throw ERROR.USER_NOT_FOUND;
  }
  const loginUserDetails = await EmployeeSchema.findOne({
    _id: new Types.ObjectId(loginUser.employeeId),
    organization: loginUser.organization._id,
  });
  if (!loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }
  customerFile.address = body.address;

  customerFile.updatedBy = new Types.ObjectId(loginUser.employeeId);
  customerFile.updatedAt = new Date();
  if (!customerFile.stepsDone.includes(STEPS_NAMES.ADDRESS)) {
    customerFile.stepsDone.push(STEPS_NAMES.ADDRESS);
  }

  await customerFile.save();
  if (customerFile.status !== "Pending") {
    CustomerFileStatusNotification({
      loanApplicationNumber: customerFile.loanApplicationNumber,
      creator: customerFile.createdBy,
      customerFileId: customerFile._id,
      updater: loginUser,
      message: {
        message: `${loginUserDetails.firstName + " " + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has updated address of the file`,
        title: `File FI-${customerFile.loanApplicationNumber} Address is updated `,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default addCustomerAddress;
