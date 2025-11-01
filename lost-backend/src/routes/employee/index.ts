import express, { Express } from 'express';
import { EmployeesControllers } from '../../controller/index';
import { hasPermission } from '../../middleware';
import { PERMISSIONS } from '../../shared/enums/permissions';
const router: Express = express();
router.get('/', hasPermission(PERMISSIONS.EMPLOYEE_VIEW), EmployeesControllers.getEmployee);
router.get('/:id', hasPermission(PERMISSIONS.EMPLOYEE_VIEW), EmployeesControllers.getEmployeeById);
router.post('/', hasPermission(PERMISSIONS.EMPLOYEE_CREATE), EmployeesControllers.addEmployee);
router.put('/', hasPermission(PERMISSIONS.EMPLOYEE_UPDATE), EmployeesControllers.editEmployee);
router.delete(
  '/block',
  hasPermission(PERMISSIONS.EMPLOYEE_BLOCK),
  EmployeesControllers.blockEmployee
);
router.patch(
  '/unblock',
  hasPermission(PERMISSIONS.EMPLOYEE_UNBLOCK),
  EmployeesControllers.unblockEmployee
);
export default router;
