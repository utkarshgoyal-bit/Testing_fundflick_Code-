import { UserSchema } from "../../models";

const getPermissions = async ({ employee, loginUser }: { employee: any; loginUser: any }) => {
  const response = await UserSchema.findOne({ _id: loginUser._id, organizations: loginUser.organization._id })
    .populate<{ roleRef: { permissions: string[]; name: string } }>("roleRef")
    .populate("employeeId")
    .populate<{ organizations: [{ modules: string[]; name: string }] }>("organizations")
    .select(["roleRef", "role", "roleRef", "employeeId", "branches", "organizations"])
    .lean();

  return {
    modules:
      response?.organizations.find((item: any) => item._id.toString() == loginUser.organization._id.toString())
        ?.modules || [],
    organizations: response?.organizations.map((item: any) => {
      return { name: item.name, isActive: item.isActive, status: item.status, _id: item._id, id: item.id };
    }),
    permissions: response?.roleRef?.permissions || [],
    role: response?.roleRef?.name || response?.role,
    branches: response?.branches,
    user: response?.employeeId,
    employment: employee,
  };
};
export default getPermissions;
