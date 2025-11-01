import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import CustomerFileSchema from '../../../schema/customerFile';
import { ERROR } from '../../../shared/enums';

const telephoneVerificationService = async ({
  fileId,
  review,
  loginUser,
  description,
}: {
  fileId: string;
  review: string;
  loginUser: LoginUser;
  description: string;
}) => {
  const file = await CustomerFileSchema.findOne({
    loanApplicationNumber: fileId,
    organization: loginUser.organization._id,
  });
  if (!file) {
    throw ERROR.NOT_FOUND;
  }
  file.teleVerificationReports.push({
    review,
    description,
    verifiedBy: new Types.ObjectId(loginUser.employeeId),
    verifiedAt: new Date().toISOString(),
  });
  return await file.save();
};

export default telephoneVerificationService;
