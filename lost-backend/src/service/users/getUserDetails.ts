import { Types } from 'mongoose';
import { LoginUser } from '../../interfaces';
import UserSchema from '../../schema/auth';
const getUserDetails = async ({ loginUser }: { loginUser: LoginUser }) => {
  const userData = await UserSchema.findOne({
    employeeId: new Types.ObjectId(loginUser.employeeId),
  })
    .populate('roleRef')
    .populate('organizations')
    .select(['roleRef', 'role', 'organizations'])
    .lean();
  return userData;
};

export default getUserDetails;
