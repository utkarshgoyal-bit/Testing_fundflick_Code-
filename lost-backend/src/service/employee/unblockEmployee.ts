import { Types } from "mongoose";
import EmployeeSchema from "../../models/employee";
const unblockEmployee = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const isUpdated = await EmployeeSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(id), organization: loginUser.organization._id },
    { isActive: true },
    {
      new: true,
      upsert: false,
    }
  );
  if (!isUpdated) {
    throw "Employee not found";
  }
  return isUpdated;
};
export default unblockEmployee;
