import { filesCommonSelectedData } from "../../main";
import customerFileSchema from "../../../../models/customerFile";
import { ERROR } from "../../../../shared/enums";
const getCustomerIncomes = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const customerFile = await customerFileSchema
    .findOne({
      _id: id,
      organization: loginUser.organization._id,
    })
    .populate("customerOtherFamilyDetails.customerDetails")
    .populate("customerDetails")
    .select({
      customerOtherFamilyDetails: 1,
      customerEmploymentDetails: 1,
      customerOtherInformation: 1,
      customerDetails: 1,
      ...filesCommonSelectedData,
    })
    .lean();
  if (!customerFile) {
    throw ERROR.USER_NOT_FOUND;
  }
  return customerFile;
};
export default getCustomerIncomes;
