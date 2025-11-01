import isSuperAdmin from '../../helper/booleanCheck/isSuperAdmin';
import checkPermission from '../../lib/permissions/checkPermission';
import { BranchSchema, CustomerFile, EmployeeSchema, UserSchema } from '../../schema';
import { PERMISSIONS } from '../../shared/enums/permissions';

const getDashboard = async ({ loginUser }: { loginUser: any }) => {
  const [
    canViewUsers,
    canViewBranches,
    canViewEmployees,
    canViewCustomerFiles,
    canViewCustomerFilesBranch,
  ] = await Promise.all([
    checkPermission(loginUser, PERMISSIONS.USER_VIEW_OTHERS),
    checkPermission(loginUser, PERMISSIONS.BRANCH_VIEW_OTHERS),
    checkPermission(loginUser, PERMISSIONS.EMPLOYEE_VIEW_OTHERS),
    checkPermission(loginUser, PERMISSIONS.CUSTOMER_FILE_VIEW_OTHERS),
    checkPermission(loginUser, PERMISSIONS.CUSTOMER_FILE_VIEW_BRANCH),
  ]);
  const _isSuperAdmin = isSuperAdmin([loginUser?.role || '']);

  const orgFilter = { organization: loginUser.organization._id };

  // helper to build queries
  const buildQuery = (canView: boolean, extra: object = {}) =>
    canView && !_isSuperAdmin
      ? { ...orgFilter, ...extra }
      : { ...orgFilter, createdBy: loginUser.employeeId, ...extra };

  // Queries
  const userQuery = buildQuery(canViewUsers);
  const employeeQuery = buildQuery(canViewEmployees);
  const branchQuery = buildQuery(canViewBranches, { branches: { $in: loginUser.branches } });

  let customerFileQuery: any = buildQuery(canViewCustomerFiles);
  if (canViewCustomerFilesBranch && !canViewCustomerFiles) {
    customerFileQuery = { ...orgFilter, fileBranch: { $in: loginUser.branches } };
  }

  // Parallel counts
  const [
    userCount,
    inactiveUsers,
    employeeCount,
    inactiveEmployees,
    branchCount,
    customerFileCount,
  ] = await Promise.all([
    UserSchema.countDocuments(userQuery),
    UserSchema.countDocuments({ ...userQuery, isActive: false }),
    EmployeeSchema.countDocuments(employeeQuery),
    EmployeeSchema.countDocuments({ ...employeeQuery, isActive: false }),
    BranchSchema.countDocuments(branchQuery),
    CustomerFile.countDocuments(customerFileQuery),
  ]);

  return {
    userCount,
    inactiveUsers,
    employeeCount,
    inactiveEmployees,
    branchCount,
    customerFileCount,
  };
};

export default getDashboard;
