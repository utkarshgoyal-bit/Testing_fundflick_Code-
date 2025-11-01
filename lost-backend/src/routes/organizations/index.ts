import express, { Express } from 'express';
import OrganizationsController from '../../controller/organization';
import { hasPermission } from '../../middleware';
const router: Express = express();

router.get('/', hasPermission(), OrganizationsController.getOrganization);
router.get('/:id', hasPermission(), OrganizationsController.getOrganizationById);
router.post('/', hasPermission(), OrganizationsController.addOrganization);
router.put('/:id', hasPermission(), OrganizationsController.editOrganization);
router.delete('/:id', hasPermission(), OrganizationsController.deleteOrganization);

export default router;
