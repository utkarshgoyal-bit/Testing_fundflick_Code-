import OrganizationSchema from "../../models/organization";

const getOrganizationById = async ({ id }: { id: string }) => {
  const organization = await OrganizationSchema.findOne({ _id: id });
  return organization;
};

export default getOrganizationById;
