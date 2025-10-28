import { Types } from "mongoose";
import { AddEmployeeReqType } from "../../controller/employee/validations";
import EmployeeSchema from "../../models/employee";
import { ERROR } from "../../shared/enums";

const addEmployee = async ({
  body,
  loginUser,
}: {
  body: AddEmployeeReqType & { organization?: Types.ObjectId };
  loginUser: any;
}) => {
  const isExist = await EmployeeSchema.findOne({ email: body.email, organization: loginUser.organization._id });
  if (isExist) {
    throw ERROR.USER_ALREADY_EXISTS;
  }
  if (!loginUser) {
    throw ERROR.USER_NOT_FOUND;
  }
  body.createdBy = new Types.ObjectId(loginUser.employeeId);
  body.organization = loginUser.organization._id;
  const employee = new EmployeeSchema(body);
  await employee.save();
  return employee;
};

export default addEmployee;
