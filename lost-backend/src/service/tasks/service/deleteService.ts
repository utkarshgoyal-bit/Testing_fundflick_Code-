import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import ClientSchema from '../../../schema/tasks/clients';
import ServicesSchema from '../../../schema/tasks/services';
import { ERROR } from '../../../shared/enums';

export default async function deleteService({
  loginUser,
  body,
}: {
  loginUser: LoginUser;
  body: {
    id: string;
  };
}) {
  const { id: serviceId } = body;
  const {
    organization: { _id: organizationId },
    employeeId,
  } = loginUser;
  const getLinkedServices =
    (await ClientSchema.find({
      organizationId: new Types.ObjectId(organizationId),
      services: { $in: [new Types.ObjectId(serviceId)] },
      MONGO_DELETED: false,
    })
      .select({ name: 1, _id: 1 })
      .lean()) || [];
  if (getLinkedServices.length > 0) {
    throw { error: ERROR.LINKED_SERVICES, linkedClients: getLinkedServices };
  }
  const deletedTask = await ServicesSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(serviceId),
      organizationId: new Types.ObjectId(organizationId),
    },
    {
      MONGO_DELETED: true,
      updatedAt: new Date(),
      updatedBy: new Types.ObjectId(employeeId),
    },
    {
      new: true,
      upsert: false,
    }
  );
  if (!deletedTask) {
    throw ERROR.SERVICE_NOT_FOUND;
  }

  return deletedTask;
}
