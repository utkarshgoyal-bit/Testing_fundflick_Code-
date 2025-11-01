import CollectionModel from '../../../schema/collection/dataModel';
const exportCasesByDate = async (loginUser: any) => {
  const data = await CollectionModel.find({ organization: loginUser.organization._id }).select({
    __v: 0,
    _id: 0,
    updatedAt: 0,
  });
  return data;
};

export default exportCasesByDate;
