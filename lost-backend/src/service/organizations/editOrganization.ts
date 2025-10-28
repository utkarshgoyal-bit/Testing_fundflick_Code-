import { Types } from "mongoose";
import OrganizationSchema from "../../models/organization";
import { STATUS } from "../../shared/enums";

const editOrganization = async ({ id, data }: { data: any; id: string }) => {
  if (data.status == STATUS.ACTIVE) {
    data.isActive = true;
  }
  const organization = await OrganizationSchema.findOneAndUpdate({ _id: new Types.ObjectId(id) }, data, {
    new: true,
    upsert: false,
  });
  return organization;
};

export default editOrganization;
