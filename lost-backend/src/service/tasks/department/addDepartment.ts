import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import DepartmentsSchema from '../../../schema/tasks/department';
interface AddDepartmentPayload {
  departmentName: string;
  departmentId: Types.ObjectId;
  subCategories: {
    returnName: string;
    frequency: string;
    description?: string;
  }[];
}

export default async function addDepartment({
  body,
  loginUser,
}: {
  body: AddDepartmentPayload;
  loginUser: LoginUser;
}) {
  const {
    organization: { _id: organizationId, name },
    employeeId,
  } = loginUser;
  const departmentData = await DepartmentsSchema.create({
    ...body,
    orgName: name,
    createdBy: new Types.ObjectId(employeeId),
    createdAt: Date.now(),
    updatedBy: new Types.ObjectId(employeeId),
    organizationId: new Types.ObjectId(organizationId),
  });

  return departmentData;
}
