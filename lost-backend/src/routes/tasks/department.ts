import express, { Express } from 'express';
import { DepartmentController } from '../../controller/index';
const router: Express = express();
router.get('/', DepartmentController.getDepartment);
router.post('/', DepartmentController.addDepartment);
router.put('/', DepartmentController.updateDepartment);
router.delete('/', DepartmentController.deleteDepartment);

export default router;
