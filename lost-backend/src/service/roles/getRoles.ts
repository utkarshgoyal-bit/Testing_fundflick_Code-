import RolesSchema from '../../schema/roles';

const getRoles = async (loginUser: any) => {
  const roles = await RolesSchema.find({ organization: loginUser.organization._id });
  return roles;
};

export default getRoles;
