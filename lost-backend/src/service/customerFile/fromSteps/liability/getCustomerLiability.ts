import customerFileSchema from '../../../../schema/customerFile';
import { ERROR } from '../../../../shared/enums';
import { filesCommonSelectedData } from '../../main';

const getCustomerLiability = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const customerFile = await customerFileSchema
    .findOne({
      _id: id,
      organization: loginUser.organization._id,
    })
    .populate('existingLoans.customerDetails')
    .populate<{
      customerDetails: any;
      customerOtherFamilyDetails: { customerDetails: any; customerType: string }[];
    }>('customerDetails')
    .populate('customerOtherFamilyDetails.customerDetails')
    .select({
      familyExpenses: 1,
      existingLoans: 1,
      customerOtherFamilyDetails: 1,
      customerDetails: 1,
      ...filesCommonSelectedData,
    });
  if (!customerFile) {
    throw ERROR.NOT_FOUND;
  }
  const allFamilyMembers = customerFile?.customerOtherFamilyDetails.map(item => {
    return {
      firstName: item.customerDetails.firstName,
      middleName: item.customerDetails.middleName,
      lastName: item.customerDetails.lastName,
      _id: item.customerDetails._id,
      customerType: item.customerType,
    };
  });
  allFamilyMembers.push({
    firstName: customerFile?.customerDetails.firstName,
    middleName: customerFile?.customerDetails.middleName,
    lastName: customerFile?.customerDetails.lastName,
    customerType: 'Self',
    _id: customerFile?.customerDetails._id,
  });
  const { ...responseData } = customerFile.toObject();
  return { ...responseData, allFamilyMembers };
};
export default getCustomerLiability;
