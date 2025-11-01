import { ROLES } from '../../shared/enums';
const isBackOfficer = (roles: string[]) => {
  return roles.includes(ROLES.BACKOFFICER);
};

export default isBackOfficer;
