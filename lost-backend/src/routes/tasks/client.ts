import express, { Express } from 'express';
import { ClientController } from '../../controller/index';
const router: Express = express();
router.get('/', ClientController.getClient);
router.get('/:id', ClientController.getClientById);
router.post('/', ClientController.addClient);
router.put('/', ClientController.updateClient);
router.delete('/', ClientController.deleteClient);

export default router;
