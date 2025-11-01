import customerFileSchema from '../../../../schema/customerFile';
import { ERROR } from '../../../../shared/enums';
import { filesCommonSelectedData } from '../../main';
const getCustomerCollateral = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const customerFile = await customerFileSchema
    .findOne({
      _id: id,
      organization: loginUser.organization._id,
    })
    .populate('collateralDetails.vehicleDetails.vehicleDetails')
    .populate<{
      customerDetails: any;
      customerOtherFamilyDetails: {
        customerDetails: any;
        customerType: string;
        relation: string;
        address: object;
      }[];
    }>('customerDetails')
    .populate('customerOtherFamilyDetails.customerDetails')
    .select({
      customerOtherFamilyDetails: 1,
      customerDetails: 1,
      loanType: 1,
      address: 1,
      collateralDetails: 1,
      ...filesCommonSelectedData,
    })
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

  const familyAddresses = customerFile.customerOtherFamilyDetails
    .map(item => item.address)
    .filter(Boolean);

  let mergedAddresses: any[] = [];
  if (Array.isArray(customerFile.address)) {
    mergedAddresses = [...customerFile.address, ...familyAddresses];
  } else if (customerFile.address) {
    mergedAddresses = [customerFile.address, ...familyAddresses];
  } else {
    mergedAddresses = [...familyAddresses];
  }

  const { ...responseData } = customerFile;
  return { ...responseData, address: mergedAddresses, allFamilyMembers };
};

export default getCustomerCollateral;
