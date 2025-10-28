import { ROLES } from "../../shared/enums";
const isSalesMan = (roles: string[]) => {
  return roles.includes(ROLES.SALES_MAN);
};

export default isSalesMan;
