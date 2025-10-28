import { Types } from "mongoose";
import RolesSchema from "../../models/roles";
import { ERROR } from "../../shared/enums";
const addRole = async ({ data, loginUser }: { data: any; loginUser: any }) => {
  if (!data.name) {
    throw ERROR.BAD_REQUEST;
  }
  const payload = {
    name: data.name,
    permissions: data.permissions || [],
    rolesAccess: data?.rolesAccess?.map((item: string) => new Types.ObjectId(item)) || [],
    createdBy: loginUser.employeeId,
    organization: loginUser.organization._id,
  };
  const role = await RolesSchema.create(payload);
  return role;
};

export default addRole;
