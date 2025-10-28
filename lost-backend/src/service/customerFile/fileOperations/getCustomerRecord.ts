import CustomerDetails from "../../../models/customerFile/customers";

const getCustomerRecord = async (aadhaarNumber: string, loginUser: any) => {
  const customer = await CustomerDetails.findOne({ aadhaarNumber, organization: loginUser.organization._id });
  return customer;
};
export default getCustomerRecord;
