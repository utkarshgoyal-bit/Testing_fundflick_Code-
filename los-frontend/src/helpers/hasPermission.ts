import store from '@/redux/store';
import { ROLES_ENUM } from '@/lib/enums';

export default function hasPermission(permission: string) {
  const permissions = store.getState().login.permissions;
  const role = store.getState().login.role;
  if (!role?.length) return false;
  if (!permissions && role !== ROLES_ENUM.SUPERADMIN) return false;
  return role === ROLES_ENUM.SUPERADMIN || permissions?.includes(permission);
}
