const getHideTaskHeading = (str: string) => {
  return str.split(':').pop();
};
const mapOrganizationConfigs = (configs: any[]) => {
  return configs.map(config => ({
    id: getHideTaskHeading(config.sk),
    value: config.value,
  }));
};

export default mapOrganizationConfigs;
