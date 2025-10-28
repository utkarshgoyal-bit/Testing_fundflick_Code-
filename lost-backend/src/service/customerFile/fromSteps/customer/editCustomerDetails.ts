import { Types } from "mongoose";
import { uploadFileToS3 } from "../../../../aws/s3";
import { ErrorModel } from "../../../../interfaces";
import { User } from "../../../../interfaces/user.interface";
import { EmployeeSchema } from "../../../../models";
import CustomerFileModel from "../../../../models/customerFile";
import CustomersModel from "../../../../models/customerFile/customers";
import { ERROR, STATUS_CODE, STEPS_NAMES } from "../../../../shared/enums";
import CustomerFileStatusNotification from "../../../../socket/sendNotification";

const editCustomerDetails = async ({
  files,
  loginUser,
  fileId,
  body,
}: {
  body: any;
  files: any;
  fileId: string;
  loginUser: any;
}) => {
  const isFileExist = await CustomerFileModel.findById(fileId);
  if (!isFileExist) {
    throw ERROR.NOT_FOUND;
  }
  if (files) {
    const { "customerDetails[uidBack]": uidBackImage, "customerDetails[uidFront]": uidFrontImage } = files;
    if (uidFrontImage) {
      const uidFront = await uploadFileToS3(
        uidFrontImage[0].path,
        `${isFileExist.loanApplicationNumber}/${"uidFront" + new Date()}`,
        uidFrontImage[0].mimetype
      );
      body.customerDetails.uidFront = uidFront;
    }
    if (uidBackImage) {
      const uidBack = await uploadFileToS3(
        uidBackImage[0].path,
        `${isFileExist.loanApplicationNumber}/${"uidBack" + new Date()}`,
        uidBackImage[0].mimetype
      );
      body.customerDetails.uidBack = uidBack;
    }
  }

  const { _id, ...rest } = body.customerDetails;
  const customer = await CustomersModel.findOneAndUpdate(
    { aadhaarNumber: body.customerDetails.aadhaarNumber, organization: loginUser.organization._id },
    {
      ...rest,
      updatedBy: new Types.ObjectId(loginUser.employeeId),
      updatedAt: new Date(),
    },
    {
      new: true,
      upsert: false,
      runValidators: true,
    }
  );
  if (!customer) {
    const error: ErrorModel = {
      message: ERROR.USER_NOT_FOUND,
      errorStatus: true,
      error: "",
      status: STATUS_CODE["400"],
    };
    throw error;
  }
  const customerFile = await CustomerFileModel.findOneAndUpdate(
    { _id: new Types.ObjectId(fileId), organization: loginUser.organization._id },
    {
      ...body,
      customerDetails: customer._id,
      $push: {
        stepsDone: STEPS_NAMES.CUSTOMER,
      },
      updatedBy: new Types.ObjectId(loginUser.employeeId),
      updatedAt: new Date(),
    },
    {
      new: true,
      upsert: false,
    }
  );
  if (!customerFile) {
    const error: ErrorModel = {
      message: ERROR.USER_NOT_FOUND,
      errorStatus: true,
      error: "",
      status: STATUS_CODE["400"],
    };
    throw error;
  }
  const loginUserDetails = await EmployeeSchema.findOne({ _id: new Types.ObjectId(loginUser.employeeId) });
  if (!loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }
  if (customerFile.status !== "Pending") {
    CustomerFileStatusNotification({
      loanApplicationNumber: customerFile.loanApplicationNumber,
      creator: customerFile.createdBy,
      customerFileId: customerFile._id,
      updater: loginUser,
      message: {
        message: `${loginUserDetails.firstName + " " + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has updated customer details of the file`,
        title: `File FI-${customerFile.loanApplicationNumber} customer details is updated `,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default editCustomerDetails;
