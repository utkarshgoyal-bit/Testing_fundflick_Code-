import OrganizationSchema from '../../schema/organization';

const getOrganizations = async () => {
  const [Organizations, count] = await Promise.all([
    OrganizationSchema.find().lean(),
    OrganizationSchema.countDocuments({ isActive: true }),
  ]);

  return {
    data: Organizations,
    total: Organizations.length,
    active: count,
  };
};
export default getOrganizations;
