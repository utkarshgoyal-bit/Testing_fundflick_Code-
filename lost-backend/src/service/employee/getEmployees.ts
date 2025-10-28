/* eslint-disable @typescript-eslint/no-explicit-any */
import EmployeeSchema from '../../models/employee';

const getEmployees = async ({ loginUser }: { loginUser: any }) => {
  const projections = {
    password: 0,
    updatedAt: 0,
    _v: 0,
    orgName: 0,
  };
  const query = {
    organization: loginUser.organization._id,
  };

  const employees = await EmployeeSchema.find(query, projections)
    .sort({
      createdAt: -1,
    })
    .lean();

  return employees;
};

export default getEmployees;
