import { Types } from 'mongoose';
import CustomerFileSchema from '../../../schema/customerFile';
import { ERROR } from '../../../shared/enums';

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
    const existingFile = file.verifiedSteps.find(item => item.step === step);
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
