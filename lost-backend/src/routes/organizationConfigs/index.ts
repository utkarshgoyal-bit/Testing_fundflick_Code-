import express, { Express } from 'express';
import OrganizationsController from '../../controller/organizationConfigs';
const router: Express = express();

router.get('/:id/configs', OrganizationsController.getOrganizationConfigs);
export default router;
