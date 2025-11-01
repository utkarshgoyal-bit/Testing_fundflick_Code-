import RolesSchema from '../../schema/roles';

const deleteRole = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const role = await RolesSchema.findOneAndDelete({
    _id: id,
    organization: loginUser.organization._id,
  });
  return role;
};

export default deleteRole;
