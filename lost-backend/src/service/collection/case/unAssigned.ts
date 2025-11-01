import CollectionModel from '../../../schema/collection/dataModel';
const unAssignCase = async (caseNo: string, loginUser: any): Promise<boolean> => {
  const data = await CollectionModel.findOneAndUpdate(
    { caseNo, organization: loginUser.organization._id },
    { assignedTo: null },
    { new: true }
  );
  if (!data) {
    throw new Error('Case not found');
  }
  return true;
};

export default unAssignCase;
