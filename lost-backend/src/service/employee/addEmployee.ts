import { Types } from 'mongoose';
import { AddEmployeeReqType } from '../../controller/employee/validations';
import { LoginUser } from '../../interfaces';
import EmployeeSchema from '../../schema/employee';
import { ERROR } from '../../shared/enums';

const addEmployee = async ({
  body,
  loginUser,
}: {
  body: AddEmployeeReqType & { organization?: Types.ObjectId };
  loginUser: LoginUser;
}) => {
  const isExist = await EmployeeSchema.findOne({
    email: body.email,
    organization: loginUser.organization._id,
  });
  if (isExist) {
    throw ERROR.USER_ALREADY_EXISTS;
  }
  if (!loginUser) {
    throw ERROR.USER_NOT_FOUND;
  }
  const payload = {
    ...body,
    organization: loginUser.organization._id,
    createdBy: new Types.ObjectId(loginUser.employeeId),
  };
  const employee = new EmployeeSchema(payload);
  await employee.save();
  return employee;
};

export default addEmployee;
