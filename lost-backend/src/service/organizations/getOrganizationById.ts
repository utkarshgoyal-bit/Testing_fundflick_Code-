import { Types } from 'mongoose';
import OrganizationSchema from '../../schema/organization';

const getOrganizationById = async ({ id }: { id: string }) => {
  const organization = await OrganizationSchema.findOne({
    _id: new Types.ObjectId(id),
    isActive: true,
    status: 'ACTIVE',
  }).lean();
  return organization;
};

export default getOrganizationById;
