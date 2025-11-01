import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import { UpdateClientPayload } from '../../../interfaces/client.interface';
import ClientSchema from '../../../schema/tasks/clients';

export default async function updateClient({
  body,
  loginUser,
}: {
  body: UpdateClientPayload;
  loginUser: LoginUser;
}) {
  if (!body.id) {
    throw new Error('Client ID is required');
  }
  const {
    organization: { _id: organizationId },
    employeeId,
  } = loginUser;
  const clientData = await ClientSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(body.id), MONGO_DELETED: false },
    {
      ...body,
      createdBy: new Types.ObjectId(employeeId),
      createdAt: Date.now(),
      updatedBy: new Types.ObjectId(employeeId),
      organizationId: new Types.ObjectId(organizationId),
    },
    { new: true, upsert: false }
  );
  if (!clientData) {
    throw new Error('Client not found or could not be updated');
  }

  return clientData;
}
