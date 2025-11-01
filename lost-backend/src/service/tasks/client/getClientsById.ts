import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import ClientSchema from '../../../schema/tasks/clients';

export default async function getClientById({
  loginUser,
  id,
}: {
  loginUser: LoginUser;
  id: string;
}) {
  const {
    organization: { _id: organizationId },
  } = loginUser;
  const data = await ClientSchema.findOne({
    _id: new Types.ObjectId(id),
    organizationId: new Types.ObjectId(organizationId),
    isDeleted: false,
  });
  return data;
}
