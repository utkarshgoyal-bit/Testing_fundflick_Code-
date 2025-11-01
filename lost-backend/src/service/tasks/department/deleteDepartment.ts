import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import DepartmentsSchema from '../../../schema/tasks/department';
import { ERROR } from '../../../shared/enums';

export default async function deleteDepartment({
  loginUser,
  body,
}: {
  loginUser: LoginUser;
  body: {
    _id: string;
  };
}) {
  const { _id } = body;
  const deletedTask = await DepartmentsSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(_id),
      createdBy: new Types.ObjectId(loginUser.employeeId),
      organization: loginUser.organization._id,
    },
    {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: new Types.ObjectId(loginUser.employeeId),
    },
    {
      new: true,
      upsert: false,
    }
  );
  if (!deletedTask) {
    throw ERROR.INVALID_OPERATION;
  }

  return deletedTask;
}
