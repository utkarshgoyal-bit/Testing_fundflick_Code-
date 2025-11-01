import { AddEmployeeReqType } from '../../controller/employee/validations';
import { ErrorModel } from '../../interfaces';
import EmployeeSchema from '../../schema/employee';
import { ERROR, STATUS_CODE } from '../../shared/enums';

const editEmployee = async ({ body, loginUser }: { body: AddEmployeeReqType; loginUser: any }) => {
  const isExist = await EmployeeSchema.findOne({
    email: body.email,
    organization: loginUser.organization._id,
  });
  if (!isExist) {
    const error: ErrorModel = {
      message: ERROR.USER_NOT_FOUND,
      errorStatus: true,
      error: '',
      status: STATUS_CODE['400'],
    };
    throw error;
  }
  await EmployeeSchema.updateOne(
    { email: body.email, organization: loginUser.organization._id },
    body
  );
  return body;
};
export default editEmployee;
