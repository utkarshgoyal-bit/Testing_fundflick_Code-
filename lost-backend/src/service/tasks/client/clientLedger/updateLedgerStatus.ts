import { Types } from 'mongoose';
import { CLIENT_LEDGER_PAYMENT_STATUS_ENUM } from '../../../../enums/task.enum';
import { LoginUser } from '../../../../interfaces';
import ClientLedgerSchema from '../../../../schema/tasks/clientLedger';

async function updateLedgerStatus(
  payload: {
    ledgerId: string;
    status: CLIENT_LEDGER_PAYMENT_STATUS_ENUM;
    date: number;
    remark: string;
    amountReceived: number;
  },
  loginUser: LoginUser
) {
  const ledger = await ClientLedgerSchema.findById(payload.ledgerId);
  if (!ledger) {
    throw new Error('Ledger not found');
  }
  ledger.paymentStatus = payload.status;
  ledger.organizationId = new Types.ObjectId(loginUser.organization._id);
  ledger.updatedBy = new Types.ObjectId(loginUser.employeeId);
  ledger.timeline.push({
    title: `Status Updated to ${payload.status}`,
    remark: `${payload.remark}`,
    createdBy: new Types.ObjectId(loginUser.employeeId),
    date: payload.date,
    amountReceived: payload.amountReceived,
  });
  await ledger.save();
  return ledger;
}

export default updateLedgerStatus;
