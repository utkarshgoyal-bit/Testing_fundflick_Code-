import TelephoneQuestionSchema from "../../models/telephoneQuestions";
import checkPermission from "../../lib/permissions/checkPermission";
import { PERMISSIONS } from "../../shared/enums/permissions";
import isSuperAdmin from "../../helper/booleanCheck/isSuperAdmin";

const getTelephoneQuestions = async (loginUser: any) => {
  const query: any = {
    isDeleted: false,
    organization: loginUser.organization._id,
  };
  const _isSuperAdmin = isSuperAdmin([loginUser?.role || ""]);
  if (!(await checkPermission(loginUser, PERMISSIONS.TELEPHONE_QUESTION_VIEW_OTHERS)) && !_isSuperAdmin) {
    query.createdBy = loginUser.employeeId;
  }
  const telephoneQuestions = await TelephoneQuestionSchema.find(query);
  return telephoneQuestions;
};

export default getTelephoneQuestions;
