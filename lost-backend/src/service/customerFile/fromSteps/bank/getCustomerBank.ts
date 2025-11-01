import customerFileSchema from '../../../../schema/customerFile';
import { ERROR } from '../../../../shared/enums';
import { filesCommonSelectedData } from '../../main';
const getCustomerBank = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const customerFile = await customerFileSchema
    .findOne({
      _id: id,
      organization: loginUser.organization._id,
    })
    .select({
      bank: 1,
      hasCreditCard: 1,
      customerOtherFamilyDetails: 1,
      customerDetails: 1,
      creditCard: 1,
      ...filesCommonSelectedData,
    })
    .populate<{
      customerDetails: any;
      customerOtherFamilyDetails: {
        customerDetails: any;
        customerType: string;
        relation: string;
      }[];
    }>('customerDetails')
    .populate('customerOtherFamilyDetails.customerDetails')
    .lean();
  if (!customerFile) {
    throw ERROR.USER_NOT_FOUND;
  }
  const allFamilyMembers = customerFile?.customerOtherFamilyDetails.map(item => {
    return {
      firstName: item.customerDetails.firstName,
      middleName: item.customerDetails.middleName,
      lastName: item.customerDetails.lastName,
      _id: item.customerDetails._id,
      customerType: item.customerType,
      relation: item.relation,
    };
  });
  allFamilyMembers.push({
    firstName: customerFile?.customerDetails.firstName,
    middleName: customerFile?.customerDetails.middleName,
    lastName: customerFile?.customerDetails.lastName,
    customerType: 'self',
    relation: 'self',
    _id: customerFile?.customerDetails._id,
  });
  const { ...responseData } = customerFile;

  return {
    ...responseData,
    allFamilyMembers,
  };
};

export default getCustomerBank;
