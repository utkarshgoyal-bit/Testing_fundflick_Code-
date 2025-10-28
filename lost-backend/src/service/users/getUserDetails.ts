import { Types } from "mongoose";
import UserSchema from "../../models/auth";
const getUserDetails = async ({ loginUser }: { loginUser: any }) => {
  const userData = await UserSchema.findOne({
    employeeId: new Types.ObjectId(loginUser.employeeId),
  })
    .populate("roleRef")
    .populate("organizations")
    .select(["roleRef", "role", "organizations"])
    .lean();
  return userData;
};

export default getUserDetails;
