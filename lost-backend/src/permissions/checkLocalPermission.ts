import isSuperAdmin from "../helper/booleanCheck/isSuperAdmin";
import { UserSchema } from "../models";

export default async function checkLocalPermission(loginUser: any, permission: string) {
  if (isSuperAdmin([loginUser?.role || ""])) return false;
  if (!loginUser || (!loginUser.roleRef && !isSuperAdmin([loginUser?.role || ""]))) return false;
  const user = await UserSchema.findOne({ employeeId: loginUser.employeeId }).populate<{
    roleRef: { permissions: string[] };
  }>("roleRef");
  if (!user) return false;
  return !isSuperAdmin([loginUser?.role || ""]) && user.roleRef.permissions.includes(permission);
}
