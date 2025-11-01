import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import DepartmentsSchema from '../../../schema/tasks/department';

export default async function getDepartments({
  loginUser,
  page,
}: {
  loginUser: LoginUser;
  page: number;
}) {
  const {
    organization: { _id: organizationId },
  } = loginUser;
  const departments = await DepartmentsSchema.find({
    organizationId: new Types.ObjectId(organizationId),
    MONGO_DELETED: false,
  })
    .skip((page - 1) * 10)
    .limit(10)
    .sort({ createdAt: -1 })
    .select({ __v: 0, MONGO_DELETED: 0 });

  return { data: departments, total: departments?.length || 0 };
}
