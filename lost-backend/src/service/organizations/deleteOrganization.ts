import OrganizationSchema from "../../models/organization";
import { STATUS } from "../../shared/enums";

const deleteOrganization = async ({ id }: { id: string }) => {
  const organization = await OrganizationSchema.findOneAndUpdate(
    { _id: id },
    {
      isActive: false,
      status: STATUS.BLOCKED,
    }
  );
  return organization;
};

export default deleteOrganization;
