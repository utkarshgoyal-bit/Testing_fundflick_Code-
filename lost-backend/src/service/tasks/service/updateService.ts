import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import ServicesSchema from '../../../schema/tasks/services';
interface UpdateServicePayload {
  _id: string;
  serviceName: string;
  departmentId: Types.ObjectId;
  subCategories: {
    returnName: string;
    frequency: string;
    description?: string;
  }[];
}

export default async function updateService({
  body,
  loginUser,
}: {
  body: UpdateServicePayload;
  loginUser: LoginUser;
}) {
  if (!body._id) {
    throw new Error('Service ID is required');
  }
  const serviceData = await ServicesSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(body._id) },
    {
      ...body,
      createdBy: new Types.ObjectId(loginUser.employeeId),
      createdAt: Date.now(),
      updatedBy: new Types.ObjectId(loginUser.employeeId),
      organization: loginUser.organization._id,
    },
    { new: true, upsert: false }
  );
  if (!serviceData) {
    throw new Error('Service not found or could not be updated');
  }

  return serviceData;
}
