import CustomerFileSchema from "../../../models/customerFile";
import { ERROR } from "../../../shared/enums";

export const filesCommonSelectedData = {
  _id: 1,
  loanApplicationNumber: 1,
  stepsDone: 1,
  verifiedSteps: 1,
  teleVerificationReport: 1,
};

const getFileById = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const file = await CustomerFileSchema.findOne({
    _id: id,
    organization: loginUser.organization._id,
  })
    .populate("collateralDetails.landDetails.ownerName")
    .populate("collateralDetails.vehicleDetails.ownerName")
    .populate("collateralDetails.vehicleDetails.vehicleDetails")
    .populate("customerDetails")
    .populate("createdBy")
    .populate("customerOtherFamilyDetails.customerDetails");

  if (!file) {
    throw ERROR.NOT_FOUND;
  }
  return file;
};

export default getFileById;
