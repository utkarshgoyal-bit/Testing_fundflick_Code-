import customerFileSchema from "../../../../models/customerFile";
import { ERROR } from "../../../../shared/enums";
import { filesCommonSelectedData } from "../../main";
const getCustomerPhotos = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const customerFile = await customerFileSchema
    .findOne({
      _id: id,
      organization: loginUser.organization._id,
    })
    .populate("customerDetails")
    .populate("customerOtherFamilyDetails.customerDetails")
    .select({
      photos: 1,
      customerOtherFamilyDetails: 1,
      customerDetails: 1,
      ...filesCommonSelectedData,
    });
  if (!customerFile) {
    throw ERROR.NOT_FOUND;
  }
  return customerFile;
};

export default getCustomerPhotos;
