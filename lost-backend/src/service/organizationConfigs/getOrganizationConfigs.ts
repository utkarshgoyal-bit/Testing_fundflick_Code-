import { Types } from 'mongoose';
import mapOrganizationConfigs from '../../helper/mapOrganizatonConfigs';
import { IOrganizationConfig } from '../../interfaces/organizationConfigs.interface';
import { OrganizationConfigs } from '../../schema';
import getOrganizationById from '../organizations/getOrganizationById';

const getOrganizationConfigs = async ({ organizationId }: { organizationId: string }) => {
  const organizationConfigDocs = await OrganizationConfigs.find({
    organizationId: new Types.ObjectId(organizationId),
  }).lean();

  const organizationConfig: IOrganizationConfig[] = organizationConfigDocs.map(doc => ({
    _id: doc._id.toString(),
    organizationId: doc.organizationId.toString(),
    category: doc.category,
    env: doc.env,
    sk: doc.sk,
    type: doc.type as IOrganizationConfig['type'],
    value: doc.value,
  }));
  const organizationById = await getOrganizationById({ id: organizationId });

  const settings = organizationConfig.filter(({ category }) => category === 'settings') || [];

  return {
    settings: mapOrganizationConfigs(settings) || [],
    organizationId: organizationId,
    name: organizationById?.name || '',
    id: organizationById?.id || '',
  };
};

export const getOrganizationSettings = async ({ organizationId }: { organizationId: string }) => {
  const organizationConfigs = await getOrganizationConfigs({
    organizationId: organizationId,
  });
  const settings = organizationConfigs?.settings || [];
  return settings;
};
export default getOrganizationConfigs;
