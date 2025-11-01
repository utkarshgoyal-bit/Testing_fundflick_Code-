import CollectionModel from '../../schema/collection/dataModel';
const updateBranchService = async (caseNo: string, newBranch: string, loginUser: any) => {
  return await CollectionModel.findOneAndUpdate(
    { caseNo, organization: loginUser.organization._id },
    { area: newBranch },
    { new: true }
  );
};

export default updateBranchService;
