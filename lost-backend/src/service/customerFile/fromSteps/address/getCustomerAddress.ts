import customerFileSchema from "../../../../models/customerFile";
import { filesCommonSelectedData } from "../../main";

const getCustomerAddress = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const customerFile = await customerFileSchema
    .findOne({
      _id: id,
      organization: loginUser.organization._id,
    })
    .select({
      address: 1,
      ...filesCommonSelectedData,
    });
  return customerFile;
};

export default getCustomerAddress;
