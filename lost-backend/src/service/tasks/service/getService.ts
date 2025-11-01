import { Types } from 'mongoose';
import { LoginUser } from '../../../interfaces';
import ServicesSchema from '../../../schema/tasks/services';

export default async function getServices({
  loginUser,
  page = 0,
}: {
  loginUser: LoginUser;
  page?: number;
}) {
  const {
    organization: { _id: organizationId },
  } = loginUser;

  const pipeline: any[] = [
    {
      $match: {
        organizationId: new Types.ObjectId(organizationId),
        MONGO_DELETED: { $eq: false },
      },
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'departments',
      },
    },
    {
      $lookup: {
        from: 'employeesv2',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
      },
    },
    {
      $lookup: {
        from: 'employeesv2',
        localField: 'updatedBy',
        foreignField: '_id',
        as: 'updatedBy',
      },
    },
    {
      $addFields: {
        departments: { $arrayElemAt: ['$departments', 0] },
        createdBy: { $arrayElemAt: ['$createdBy', 0] },
        updatedBy: { $arrayElemAt: ['$updatedBy', 0] },
      },
    },
    {
      $project: {
        MONGO_DELETED: 0,
        departmentId: 0,
        'departments.updatedAt': 0,
        'departments.__v': 0,
        'departments.MONGO_DELETED': 0,
        'departments.isDeleted': 0,
        'createdBy.MONGO_DELETED': 0,
        'createdBy.maritalStatus': 0,
        'createdBy.qualification': 0,
        'createdBy.addressLine1': 0,
        'createdBy.addressLine2': 0,
        'createdBy.organization': 0,
        'createdBy.uid': 0,
        'createdBy.pan': 0,
        'createdBy.passport': 0,
        'createdBy.voterID': 0,
        'createdBy.drivingLicense': 0,
        'createdBy.baseSalary': 0,
        'createdBy.hra': 0,
        'createdBy.conveyance': 0,
        'createdBy.incentive': 0,
        'createdBy.commission': 0,
        'createdBy.ledger': 0,
        'createdBy.accountNumber': 0,
        'createdBy.ifsc': 0,
        'createdBy.bankName': 0,
        'createdBy.accountName': 0,
        'updatedBy.MONGO_DELETED': 0,
        'updatedBy.maritalStatus': 0,
        'updatedBy.qualification': 0,
        'updatedBy.addressLine1': 0,
        'updatedBy.addressLine2': 0,
        'updatedBy.organization': 0,
        'updatedBy.uid': 0,
        'updatedBy.pan': 0,
        'updatedBy.passport': 0,
        'updatedBy.voterID': 0,
        'updatedBy.drivingLicense': 0,
        'updatedBy.baseSalary': 0,
        'updatedBy.hra': 0,
        'updatedBy.conveyance': 0,
        'updatedBy.incentive': 0,
        'updatedBy.commission': 0,
        'updatedBy.ledger': 0,
        'updatedBy.accountNumber': 0,
        'updatedBy.ifsc': 0,
        'updatedBy.bankName': 0,
        'updatedBy.accountName': 0,
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  if (page !== undefined && page > 0) {
    pipeline.push({ $skip: (page - 1) * 10 });
    pipeline.push({ $limit: 10 });
  }

  const data = await ServicesSchema.aggregate(pipeline);
  const total = data.length;
  return { data, total };
}
