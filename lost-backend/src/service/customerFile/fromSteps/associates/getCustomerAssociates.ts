import customerFileSchema from '../../../../schema/customerFile';
import { ERROR } from '../../../../shared/enums';
import { filesCommonSelectedData } from '../../main';

const getCustomerAssociates = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const customerFile = await customerFileSchema
    .findOne({
      _id: id,
      organization: loginUser.organization._id,
    })
    .populate('customerOtherFamilyDetails.customerDetails')
    .populate('customerDetails')
    .select({
      customerOtherFamilyDetails: 1,
      customerDetails: 1,
      address: 1,
      ...filesCommonSelectedData,
    })
    .lean();
  if (!customerFile) {
    throw ERROR.USER_NOT_FOUND;
  }
  return customerFile;
};

export default getCustomerAssociates;
