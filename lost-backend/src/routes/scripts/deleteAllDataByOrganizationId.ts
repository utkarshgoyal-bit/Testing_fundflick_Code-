import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {
  BranchSchema,
  ClientSchema,
  EmployeeSchema,
  OrganizationConfigs,
  OrganizationSchema,
  PaymentDataRevisions,
  PendencySchema,
  TaskSchema,
  UserSchema,
} from '../../schema';

const deleteAllDataByOrganizationId = async (req: Request, res: Response) => {
  const { organizationId = '' } = req.body;
  const orgId = new Types.ObjectId(organizationId || '');
  if (!orgId) {
    return res.status(400).json({ message: 'organizationId is required' });
  }
  const branchDeletedCount = await BranchSchema.deleteMany({ organization: orgId });
  const deletedCount = await EmployeeSchema.deleteMany({ organizationId: orgId });
  const clientDeletedCount = await ClientSchema.deleteMany({ organizationId: orgId });
  const paymentDataDeletedCount = await PaymentDataRevisions.deleteMany({ organization: orgId });
  const pendencyDeletedCount = await PendencySchema.deleteMany({ organization: orgId });
  const taskDeletedCount = await TaskSchema.deleteMany({ organizationId: orgId });
  const userDeletedCount = await UserSchema.updateMany(
    { organizations: { $in: [orgId] } },
    { $pull: { organizations: orgId } }
  );
  const employeeDeletedCount = await EmployeeSchema.deleteMany({ organizationId: orgId });
  const organizationConfigsDeletedCount = await OrganizationConfigs.deleteMany({
    organizationId: orgId,
  });
  const organizationDeletedCount = await OrganizationSchema.deleteMany({ _id: orgId });
  res.status(200).json({
    message: 'SUCCESS',
    deletedCount,
    branchDeletedCount,
    clientDeletedCount,
    paymentDataDeletedCount,
    pendencyDeletedCount,
    taskDeletedCount,
    userDeletedCount,
    employeeDeletedCount,
    organizationConfigsDeletedCount,
    organizationDeletedCount,
  });
};
export default deleteAllDataByOrganizationId;
