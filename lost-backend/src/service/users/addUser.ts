import { Types } from 'mongoose';
import { AddUserReqType } from '../../controller/users/validations';
import { encrypt } from '../../helper/encrypt';
import UserSchema from '../../schema/auth';
import { ERROR } from '../../shared/enums';
const addUser = async ({
  body,
  loginUser,
}: {
  body: AddUserReqType & { organizations?: [Types.ObjectId] };
  loginUser: any;
}) => {
  const userData = await UserSchema.findOne({
    employeeId: new Types.ObjectId(body.employeeId),
    organizations: loginUser.organization._id,
  });
  if (userData) {
    throw ERROR.USER_ALREADY_EXISTS;
  }
  if (!loginUser) {
    throw ERROR.USER_NOT_FOUND;
  }
  body.createdBy = new Types.ObjectId(loginUser.employeeId);
  body.organizations = [loginUser.organization._id];
  const user = new UserSchema({
    ...body,
    password: await encrypt('test@123'),
  });
  await user.save();
  return user;
};

export default addUser;
