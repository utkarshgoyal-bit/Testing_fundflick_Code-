import { Types } from 'mongoose';
import { AddUserReqType } from '../../controller/users/validations';
import UserSchema from '../../schema/auth';
const editUser = async ({ body, loginUser }: { body: AddUserReqType; loginUser: any }) => {
  const updatedUser = await UserSchema.findOneAndUpdate(
    { employeeId: new Types.ObjectId(body.employeeId), organizations: loginUser.organization._id },
    body,
    {
      new: true,
      upsert: false,
    }
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

export default editUser;
