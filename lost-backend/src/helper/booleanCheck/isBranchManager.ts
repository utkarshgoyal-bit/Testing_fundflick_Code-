import { ROLES } from '../../shared/enums';
const isBranchManager = (roles: string[]) => {
  return roles.includes(ROLES.BRANCH_MANAGER);
};

export default isBranchManager;
