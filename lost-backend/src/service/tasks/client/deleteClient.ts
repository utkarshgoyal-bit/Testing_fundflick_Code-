import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import ClientSchema from '../../../schema/tasks/clients';
import { ERROR } from '../../../shared/enums';

export default async function deleteClient({
  loginUser,
  body,
}: {
  loginUser: LoginUser;
  body: {
    id: string;
  };
}) {
  const { id } = body;
  const {
    organization: { _id: organizationId },
  } = loginUser;
  const deletedClient = await ClientSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(id),
      organizationId: new Types.ObjectId(organizationId),
    },
    {
      MONGO_DELETED: true,
      updatedAt: new Date(),
      updatedBy: new Types.ObjectId(loginUser.employeeId),
    },
    {
      new: true,
      upsert: false,
    }
  );
  if (!deletedClient) {
    throw ERROR.INVALID_OPERATION;
  }

  return deletedClient;
}
