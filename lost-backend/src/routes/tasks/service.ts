import express, { Express } from 'express';
import { ServiceController } from '../../controller/index';
const router: Express = express();
router.get('/', ServiceController.getServices);
router.get('/:id', ServiceController.getServicesById);
router.post('/', ServiceController.addService);
router.put('/', ServiceController.updateService);
router.delete('/', ServiceController.deleteService);

export default router;
