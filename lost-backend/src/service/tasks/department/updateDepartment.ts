import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import DepartmentsSchema from '../../../schema/tasks/department';
interface UpdateDepartmentPayload {
  _id: string;
  departmentName: string;
  departmentId: Types.ObjectId;
  subCategories: {
    returnName: string;
    frequency: string;
    description?: string;
  }[];
}

export default async function updateDepartment({
  body,
  loginUser,
}: {
  body: UpdateDepartmentPayload;
  loginUser: LoginUser;
}) {
  if (!body._id) {
    throw new Error('Department ID is required');
  }
  const departmentData = await DepartmentsSchema.findOneAndUpdate(
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
  if (!departmentData) {
    throw new Error('Department not found or could not be updated');
  }

  return departmentData;
}
