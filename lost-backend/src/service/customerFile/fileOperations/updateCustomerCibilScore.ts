import { Types } from "mongoose";
import { uploadFileToS3 } from "../../../aws/s3";
import { User } from "../../../interfaces/user.interface";
import { EmployeeSchema } from "../../../models";
import CustomerFileSchema from "../../../models/customerFile";
import { ERROR } from "../../../shared/enums";
import CustomerFileStatusNotification from "../../../socket/sendNotification";

const updateCustomerCibilScore = async ({
  fileId,
  body,
  files,
  loginUser,
}: {
  files: any;
  fileId: string;
  body: any;
  loginUser: any;
}) => {
  if (!loginUser) {
    throw ERROR.USER_NOT_FOUND;
  }
  const loginUserDetails = await EmployeeSchema.findOne({
    _id: new Types.ObjectId(loginUser.employeeId),
    organization: loginUser.organization._id,
  });
  const customerFile = await CustomerFileSchema.findOne({
    _id: fileId,
    organization: loginUser.organization._id,
  });
  if (!customerFile || !loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }
  if (files) {
    const { "cibilDetails[file]": cibilFile } = files;
    if (cibilFile) {
      const file = await uploadFileToS3(
        cibilFile[0].path,
        `${customerFile.loanApplicationNumber}/${"cibilFile" + new Date()}`,
        cibilFile[0].mimetype
      );
      body.cibilDetails.file = file;
    }
  }

  const existingCibil = customerFile.cibilDetails.find((item: any) =>
    item?.customerDetails?.equals(body.cibilDetails.customerDetails)
  );
  if (existingCibil) {
    existingCibil.Score = body.cibilDetails.Score;
    existingCibil.file = body.cibilDetails.file;
  } else {
    customerFile.cibilDetails.push(body.cibilDetails);
  }
  await customerFile.save();
  CustomerFileStatusNotification({
    loanApplicationNumber: customerFile.loanApplicationNumber,
    creator: customerFile.createdBy,
    customerFileId: customerFile._id,
    updater: loginUser,
    message: {
      message: `${loginUserDetails.firstName + " " + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has updated cibil score on file`,
      title: `File FI-${customerFile.loanApplicationNumber} cibil score is updated`,
    },
    organization: loginUser.organization._id,
  });
  return true;
};
export default updateCustomerCibilScore;
