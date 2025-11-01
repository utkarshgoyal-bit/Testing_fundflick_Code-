export interface IOrganizationConfig {
  _id: string;
  organizationId: string;
  category: string;
  env: string;
  sk: string;
  type: 'f' | 's' | 'n' | 'b' | 'o' | 'a';
  value: string | number | boolean;
}
