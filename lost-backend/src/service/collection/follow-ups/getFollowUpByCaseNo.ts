import CollectionModel from '../../../schema/collection/dataModel';
const getFollowUpByCaseNo = async (caseNo: string, loginUser: any) => {
  try {
    const dataRecord = await CollectionModel.findOne({
      caseNo,
      organization: loginUser.organization._id,
    });
    if (!dataRecord) {
      throw new Error('Case not found');
    }
    return dataRecord;
  } catch (error) {
    console.error('Error in fetchCaseDetailsByCaseNo:', error);
    throw error;
  }
};
export default getFollowUpByCaseNo;
