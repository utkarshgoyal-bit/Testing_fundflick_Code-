import CustomerFileModel from '../../../../schema/customerFile';
import { filesCommonSelectedData } from '../../main';

const getCustomerDetails = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const customer = await CustomerFileModel.findOne({
    _id: id,
    organization: loginUser.organization._id,
  })
    .populate('customerDetails')
    .select({
      customerDetails: 1,
      fileBranch: 1,
      loanType: 1,
      endUseOfMoney: 1,
      loanAmount: 1,
      loanTenure: 1,
      emiComfort: 1,
      ...filesCommonSelectedData,
    })
    .lean();
  return customer;
};

export default getCustomerDetails;
