import { Types } from 'mongoose';
import EmployeeSchema from '../../schema/employee';

const getEmployeeById = async ({ loginUser, id }: { loginUser: any; id: string }) => {
  const projections = {
    password: 0,
    updatedAt: 0,
    _v: 0,
    orgName: 0,
  };
  const query: any = {
    _id: new Types.ObjectId(id),
    organization: loginUser.organization._id,
  };

  const customerFiles = await EmployeeSchema.find(query, projections).sort({
    createdAt: -1,
  });
  return customerFiles[0];
};
export default getEmployeeById;
