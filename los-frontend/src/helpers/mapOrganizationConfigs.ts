const getHideTaskHeading = (str: string) => {
  return str.split(':').pop();
};
const mapOrganizationConfigs = (configs: any[]) => {
  return configs.map((config) => ({
    id: getHideTaskHeading(config.sk),
    value: config.value,
    createdAt: config.createdAt,
    updatedAt: config.updatedAt,
    category: config.category,
    type: config.type,
    organizationId: config.organizationId,
  }));
};

export default mapOrganizationConfigs;
