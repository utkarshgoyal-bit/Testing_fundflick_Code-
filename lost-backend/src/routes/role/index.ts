import express, { Express } from 'express';
import RolesController from '../../controller/roles';
import { hasPermission } from '../../middleware';
import { PERMISSIONS } from '../../shared/enums/permissions';
const router: Express = express();

router.get('/permissions', RolesController.getPermissions);
router.get('/', hasPermission(PERMISSIONS.ROLE_VIEW), RolesController.getRole);
router.get('/:id', hasPermission(PERMISSIONS.ROLE_VIEW), RolesController.getRoleById);
router.post('/', hasPermission(PERMISSIONS.ROLE_CREATE), RolesController.addRole);
router.put('/:id', hasPermission(PERMISSIONS.ROLE_UPDATE), RolesController.editRole);
router.delete('/:id', hasPermission(PERMISSIONS.ROLE_DELETE), RolesController.deleteRole);

export default router;
