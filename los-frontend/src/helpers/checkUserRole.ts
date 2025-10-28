import { ROLES_ENUM } from '@/lib/enums';
export const isSuperAdmin = (role: string | undefined | null) => {
  return ROLES_ENUM.SUPERADMIN === role;
};

export const isBackOffice = (role: string | undefined | null) => {
  return ROLES_ENUM.BACKOFFICER === role;
};
export const isClusterHead = (role: string | undefined | null) => {
  return ROLES_ENUM.CLUSTER_HEAD === role;
};
export const isBranchManager = (role: string | undefined | null) => {
  return ROLES_ENUM.BRANCH_MANAGER === role;
};
export const isCollectionHead = (role: string | undefined | null) => {
  return ROLES_ENUM.COLLECTION_HEAD === role;
};

export const isAll = (role: string | undefined | null) => {
  return ROLES_ENUM.ALL === role;
};
export const isSalesMan = (role: string) => {
  return [ROLES_ENUM.SALES_MAN].includes(role as ROLES_ENUM);
};
export const isAdmin = (role: string) => {
  return [ROLES_ENUM.BRANCH_MANAGER, ROLES_ENUM.CLUSTER_HEAD].includes(role as ROLES_ENUM);
};
