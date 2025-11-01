import { Types } from 'mongoose';
import ClientLedgerSchema from '../../../../schema/tasks/clientLedger';

async function getLedgers(
  clientId: string,
  filters: { from?: number; to?: number; departmentId?: string }
) {
  const { from, to } = filters;
  const query: Record<string, unknown> = {};

  if (from && to) {
    if (from === to) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);
      query.dateOfCompletion = { $gte: startOfDay, $lte: endOfDay };
    } else {
      query.dateOfCompletion = { $gte: new Date(from), $lte: new Date(to) };
    }
  } else if (from) {
    query.dateOfCompletion = { $gte: new Date(from).setHours(0, 0, 0, 0) };
  } else if (to) {
    query.dateOfCompletion = { $lte: new Date(to).setHours(23, 59, 59, 999) };
  } else {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    query.dateOfCompletion = { $gte: startOfMonth, $lte: endOfMonth };
  }

  const ledgers = await ClientLedgerSchema.find(
    {
      clientId: new Types.ObjectId(clientId),
      ...query,
    },
    {
      clientId: 1,
      dateOfCompletion: 1,
      organizationId: 1,
      serviceId: 1,
      title: 1,
      completedBy: 1,
      createdAt: 1,
      paymentStatus: 1,
      timeline: 1,
    }
  )
    .populate('completedBy', 'firstName lastName')
    .populate('serviceId', 'serviceName')
    .populate('clientId', 'name');

  return ledgers;
}

export default getLedgers;
