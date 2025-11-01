import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import ServicesSchema from '../../../schema/tasks/services';

export default async function getServicesById({
  loginUser,
  id,
}: {
  loginUser: LoginUser;
  id: string;
}) {
  const data = await ServicesSchema.findOne({
    _id: new Types.ObjectId(id),
    organization: loginUser.organization._id,
    isDeleted: false,
  });

  return data;
}
