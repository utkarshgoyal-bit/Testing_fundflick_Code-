import PaymentData from '../../../schema/collection/payment';
const getAllPayments = async (loginUser: any) => {
  try {
    return await PaymentData.find({ organization: loginUser.organization._id })
      .populate(['refCaseId', 'createdBy'])
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error in fetchAllPayments:', error);
    throw new Error('An error occurred while fetching payment data.');
  }
};

export default getAllPayments;
