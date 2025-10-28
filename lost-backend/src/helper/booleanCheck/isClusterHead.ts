import { ROLES } from "../../shared/enums";
const isClusterHead = (roles: string[]) => {
  return roles.includes(ROLES.CLUSTER_HEAD);
};

export default isClusterHead;
