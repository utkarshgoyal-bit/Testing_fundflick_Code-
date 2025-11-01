import isSuperAdmin from '../../helper/booleanCheck/isSuperAdmin';
import { UserSchema } from '../../schema';

export default async function checkPermission(loginUser: any, permission: string) {
  if (isSuperAdmin([loginUser?.role || ''])) return true;
  if (!loginUser || (!loginUser.roleRef && !isSuperAdmin([loginUser?.role || '']))) return false;
  const user = await UserSchema.findOne({ employeeId: loginUser.employeeId }).populate<{
    roleRef: { permissions: string[] };
  }>('roleRef');
  if (!user) return false;
  return !isSuperAdmin([loginUser?.role || '']) && user.roleRef.permissions.includes(permission);
}
