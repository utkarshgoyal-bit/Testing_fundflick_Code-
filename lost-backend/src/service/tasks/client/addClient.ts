import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import { AddClientPayload } from '../../../interfaces/client.interface';
import ClientSchema from '../../../schema/tasks/clients';

export default async function addClient({
  body,
  loginUser,
}: {
  body: AddClientPayload;
  loginUser: LoginUser;
}) {
  const {
    organization: { _id: organizationId },
    employeeId,
  } = loginUser;

  const createClientPayload = {
    ...body,
    createdBy: new Types.ObjectId(employeeId),
    createdAt: Date.now(),
    updatedBy: new Types.ObjectId(employeeId),
    organizationId: organizationId,
  };

  const clientData = await ClientSchema.create(createClientPayload);

  return clientData;
}
