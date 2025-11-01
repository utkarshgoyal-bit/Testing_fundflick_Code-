import { Types } from 'mongoose';
import isSuperAdmin from '../../helper/booleanCheck/isSuperAdmin';
import checkPermission from '../../lib/permissions/checkPermission';
import UserSchema from '../../schema/auth';
import { PERMISSIONS } from '../../shared/enums/permissions';

const getUserById = async ({ loginUser, id }: { loginUser: any; id: string }) => {
  const hasCreatePermission = await checkPermission(loginUser, PERMISSIONS.USER_CREATE);
  const projections = {
    password: 0,
    updatedAt: 0,
    _v: 0,
    orgName: 0,
  };
  let query: any = {
    _id: new Types.ObjectId(id),
    organizations: loginUser.organization._id,
  };

  query = {
    ...query,
    ...(loginUser.role &&
      !hasCreatePermission &&
      !isSuperAdmin([loginUser?.role]) && {
        branches: { $in: loginUser?.branches },
        employeeId: { $ne: loginUser?.employeeId },
      }),
  };

  const users = await UserSchema.find(query, projections)
    .populate(['employeeId', 'roleRef'])
    .sort({ createdAt: -1 });
  return users.map((item: any) => ({
    _id: item._id,
    isActive: item.isActive,
    role: item.role,
    roleRef: {
      _id: item.roleRef?._id,
      name: item.roleRef?.name,
      permissions: item.roleRef?.permissions,
    },
    branches: item.branches,
    employeeId: item.employeeId?._id,
    name: item.employeeId?.firstName + ' ' + item.employeeId?.lastName,
    email: item.employeeId?.email,
    mobile: item.employeeId?.mobile,
    dob: item.employeeId?.dob,
    address: item.employeeId?.address,
    ledgerBalanceHistory: item?.ledgerBalanceHistory,
    ledgerBalance: item?.ledgerBalance,
    createdAt: item?.createdAt,
  }));
};

export default getUserById;
