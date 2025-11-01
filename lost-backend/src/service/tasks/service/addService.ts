import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import ServicesSchema from '../../../schema/tasks/services';
interface AddServicePayload {
  serviceName: string;
  departmentId: Types.ObjectId;
  subCategories: {
    returnName: string;
    frequency: string;
    description?: string;
  }[];
}

export default async function addService({
  body,
  loginUser,
}: {
  body: AddServicePayload;
  loginUser: LoginUser;
}) {
  const { departmentId, ...rest } = body;
  const {
    organization: { _id: organizationId },
  } = loginUser;
  const serviceData = await ServicesSchema.create({
    ...rest,
    departmentId: new Types.ObjectId(departmentId),
    createdBy: new Types.ObjectId(loginUser.employeeId),
    updatedBy: new Types.ObjectId(loginUser.employeeId),
    organizationId,
  });
  return serviceData;
}
