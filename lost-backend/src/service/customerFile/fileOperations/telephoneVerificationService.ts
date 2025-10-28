import { Types } from "mongoose";
import { User } from "../../../interfaces/user.interface";
import CustomerFileSchema from "../../../models/customerFile";
import { ERROR } from "../../../shared/enums";

const telephoneVerificationService = async ({
  fileId,
  review,
  loginUser,
  description,
}: {
  fileId: string;
  review: string;
  loginUser: any;
  description: string;
}) => {
  const file = await CustomerFileSchema.findOne({
    loanApplicationNumber: fileId,
    organization: loginUser.organization._id,
  });
  if (!file) {
    throw ERROR.NOT_FOUND;
  }
  file.teleVerificationReport = {
    review,
    description,
    verifiedBy: new Types.ObjectId(loginUser.employeeId),
  };
  return await file.save();
};

export default telephoneVerificationService;
