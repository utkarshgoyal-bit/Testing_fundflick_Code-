import express, { Express } from 'express';
import { ClientLedgerController } from '../../controller/index';
const router: Express = express();
router.get('/', ClientLedgerController.getClientLedgers);
router.get('/:id', ClientLedgerController.getClientLedgerById);
router.put('/', ClientLedgerController.updateClientLedger);

export default router;
