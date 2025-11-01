import { ROLES } from '../../shared/enums';
const isSuperAdmin = (roles?: string[]) => {
  if (!roles) return false;
  return roles.includes(ROLES.SUPERADMIN);
};

export default isSuperAdmin;
