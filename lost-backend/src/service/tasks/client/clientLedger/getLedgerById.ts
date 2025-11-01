import { Types } from 'mongoose';
import ClientLedgerSchema from '../../../../schema/tasks/clientLedger';

async function getLedgerById(ledgerId: string) {
  const ledger = await ClientLedgerSchema.find({
    _id: new Types.ObjectId(ledgerId),
    isDeleted: false,
    MONGO_DELETED: false,
  });
  return ledger;
}
export default getLedgerById;
