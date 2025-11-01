import { Types } from 'mongoose';
import isSuperAdmin from '../../../helper/booleanCheck/isSuperAdmin';
import checkPermission from '../../../lib/permissions/checkPermission';
import { UserSchema } from '../../../schema';
import CustomerFileSchema from '../../../schema/customerFile';
import { ERROR, ROLES } from '../../../shared/enums';
import { PERMISSIONS } from '../../../shared/enums/permissions';

const fileHandlersService = async ({ fileId, loginUser }: { fileId: string; loginUser: any }) => {
  const file = await CustomerFileSchema.findOne({
    loanApplicationNumber: fileId,
  });
  if (!file) {
    throw ERROR.USER_NOT_FOUND;
  }
  const _isSuperAdmin = isSuperAdmin([loginUser?.role || '']);

  const [_canViewSelf, _canViewBranch] = await Promise.all([
    checkPermission(loginUser, PERMISSIONS.CUSTOMER_FILE_VIEW_SELF),
    checkPermission(loginUser, PERMISSIONS.CUSTOMER_FILE_VIEW_BRANCH),
  ]);

  if (_canViewSelf && !_isSuperAdmin) {
    throw ERROR.INVALID_OPERATION;
  }
  let query: {} = {
    organization: loginUser.organization._id,
  };
  if (_canViewBranch && !_isSuperAdmin) {
    query = {
      role: { $ne: ROLES.SUPERADMIN },
      branches: { $in: [file.fileBranch] },
    };
  } else {
    query = {
      role: { $ne: ROLES.SUPERADMIN },
      branches: { $in: [file.fileBranch] },
    };
  }
  query = {
    $or: [{ ...query }, { employeeId: new Types.ObjectId(file.createdBy) }],
  };
  const users = await UserSchema.find(query)
    .populate('employeeId', ['_id', 'firstName', 'lastName'])
    .populate('roleRef', ['_id', 'name'])
    .sort({ createdAt: -1 })
    .select({
      employeeId: 1,
      role: 1,
    });
  return users;
};

export default fileHandlersService;
