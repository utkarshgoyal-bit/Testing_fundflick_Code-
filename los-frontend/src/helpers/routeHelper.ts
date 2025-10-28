export function buildOrgRoute(route: string) {
  const organization = location.pathname.split('/')[2];
  if (!organization) throw new Error('Organization is undefined in route builder');
  return `/app/${organization}${route}`;
}
