import { isTrue } from '../../helper';
import isSuperAdmin from '../../helper/booleanCheck/isSuperAdmin';
import { LoginUser } from '../../interfaces';
import checkPermission from '../../lib/permissions/checkPermission';
import { UserSchema } from '../../schema';
import { PERMISSIONS } from '../../shared/enums/permissions';
const getUsers = async ({
  loginUser,
  isBlocked,
  branchName,
  isAllowSelfUser,
}: {
  loginUser: LoginUser;
  isBlocked?: string | null;
  branchName?: string;
  isAllowSelfUser?: boolean;
}) => {
  const {
    organization: { _id: organizationId },
    employeeId,
  } = loginUser;

  const projections = {
    password: 0,
    updatedAt: 0,
    _v: 0,
    orgName: 0,
  };

  let query: {
    organizations: string;
    $or?: { branches?: { $in?: string[] }; employeeId?: string }[];
    branches?: { $in?: string[] };
    MONGO_DELETED?: { $ne: boolean };
  } = {
    organizations: organizationId,
  };

  const [canCreateUser, canViewBranch, canViewOthers] = await Promise.all([
    checkPermission(loginUser, PERMISSIONS.USER_CREATE),
    checkPermission(loginUser, PERMISSIONS.USER_VIEW_BRANCH),
    checkPermission(loginUser, PERMISSIONS.USER_VIEW_OTHERS),
  ]);
  const _isSuperAdmin = isSuperAdmin([loginUser?.role || '']);
  if (!canViewOthers && !canCreateUser && !_isSuperAdmin) {
    query.$or = [];

    if (canViewBranch) {
      query.$or.push({
        branches: { $in: loginUser?.branches },
      });
    }

    if (query.$or.length === 0 && loginUser.branches?.length) {
      query.branches = { $in: loginUser.branches };
      delete query.$or;
    }
  }
  query = {
    ...query,
    ...(!isAllowSelfUser && {
      employeeId: { $ne: employeeId },
    }),
    ...(branchName && {
      branches: { $in: [branchName] },
    }),
    ...(isBlocked && {
      isActive: !isTrue(isBlocked),
    }),
    MONGO_DELETED: { $ne: true },
  };

  const users = await UserSchema.find(query, projections)
    .populate(['employeeId', 'roleRef'])
    .sort({ isActive: -1, createdAt: -1 });

  const mappedUsers = users.map((item: any) => ({
    _id: item._id,
    isActive: item.isActive,
    role: item.role,
    ...(item.roleRef && {
      roleRef: {
        _id: item.roleRef._id,
        name: item.roleRef.name,
        permissions: item.roleRef.permissions,
      },
    }),
    branches: item.branches,
    employeeId: item.employeeId?._id,
    name: [item.employeeId?.firstName, item.employeeId?.lastName].filter(Boolean).join(' '),
    email: item.employeeId?.email,
    mobile: item.employeeId?.mobile,
    dob: item.employeeId?.dob,
    address: item.employeeId?.address,
    ledgerBalanceHistory: item.ledgerBalanceHistory,
    ledgerBalance: item.ledgerBalance,
    createdAt: item.createdAt,
  }));
  return mappedUsers;
};

export default getUsers;
