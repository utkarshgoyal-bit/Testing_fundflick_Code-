import RolesSchema from '../../schema/roles';

const getRoleById = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const role = await RolesSchema.findOne({ _id: id, organization: loginUser.organization._id });
  return role;
};

export default getRoleById;
