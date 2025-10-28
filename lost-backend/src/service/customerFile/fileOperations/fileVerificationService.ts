import { Types } from "mongoose";
import CustomerFileSchema from "../../../models/customerFile";
import { ERROR } from "../../../shared/enums";

const fileVerificationService = async ({
  fileId,
  step,
  loginUser,
  isVerified,
}: {
  fileId: string;
  step: string;
  loginUser: any;
  isVerified: boolean;
}) => {
  const file = await CustomerFileSchema.findOne({
    loanApplicationNumber: fileId,
    organization: loginUser.organization._id,
  });
  if (!file) {
    throw ERROR.NOT_FOUND;
  }
  if (file.verifiedSteps.length) {
    let existingFile = file.verifiedSteps.find((item: any) => item.step == step);
    if (existingFile) {
      existingFile.step = step;
      existingFile.isVerified = isVerified;
      existingFile.verifiedBy = new Types.ObjectId(loginUser.employeeId);
      return await file.save();
    }
  }

  file.verifiedSteps.push({
    step,
    isVerified,
    verifiedBy: new Types.ObjectId(loginUser.employeeId),
  });
  return await file.save();
};
export default fileVerificationService;
