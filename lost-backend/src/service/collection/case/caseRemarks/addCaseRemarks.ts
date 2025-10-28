import { Types } from "mongoose";
import CollectionModel from "../../../../models/collection/dataModel";
const addCaseRemarks = async ({ caseNo, remark, loginUser }: { caseNo: string; remark: string; loginUser: any }) => {
  if (!caseNo) {
    throw new Error("Case number is required");
  }
  const payload = {
    remark: remark,
    updatedBy: new Types.ObjectId(loginUser.employeeId),
  };
  const data = await CollectionModel.findOneAndUpdate(
    { caseNo, organization: loginUser.organization._id },
    { $push: { remarks: payload } },
    { new: true, upsert: false }
  );
  if (!data) {
    throw new Error("Case not found");
  }
  return true;
};
export default addCaseRemarks;
