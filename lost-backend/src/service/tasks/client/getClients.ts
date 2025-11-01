import { LoginUser } from '../../../interfaces';
import ClientSchema from '../../../schema/tasks/clients';

export default async function getClients({
  loginUser,
  page,
}: {
  loginUser: LoginUser;
  page: number;
}) {
  const {
    organization: { _id: organizationId },
  } = loginUser;
  const projections = {
    password: 0,
    updatedAt: 0,
    _v: 0,
    orgName: 0,
    MONGO_DELETED: 0,
    __v: 0,
    portalPassword: 0,
  };

  const clients = await ClientSchema.aggregate([
    {
      $match: {
        organizationId: organizationId,
        isDeleted: false,
        MONGO_DELETED: false,
      },
    },
    {
      $lookup: {
        from: 'services',
        localField: 'services',
        foreignField: '_id',
        as: 'services',
        pipeline: [
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
              updatedAt: 0,
              __v: 0,
              MONGO_DELETED: 0,
              isDeleted: 0,
              departmentId: 0,
              'departments.updatedAt': 0,
              'departments.__v': 0,
              'departments.MONGO_DELETED': 0,
              'departments.isDeleted': 0,
              'createdBy.MONGO_DELETED': 0,
              'createdBy.maritalStatus': 0,
              'createdBy.organization': 0,
              'updatedBy.MONGO_DELETED': 0,
              'updatedBy.organization': 0,
            },
          },
        ],
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
        createdBy: { $arrayElemAt: ['$createdBy', 0] },
        updatedBy: { $arrayElemAt: ['$updatedBy', 0] },
      },
    },
    {
      $project: {
        ...projections,
        'createdBy.MONGO_DELETED': 0,
        'createdBy.maritalStatus': 0,
        'createdBy.qualification': 0,
        'createdBy.addressLine1': 0,
        'createdBy.MONOGO_DELETED': 0,
        'createdBy.organization': 0,
        'updatedBy.MONGO_DELETED': 0,
        'updatedBy.MONOGO_DELETED': 0,
        'updatedBy.organization': 0,
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * 10 },
    { $limit: 10 },
  ]);

  return { data: clients, total: clients.length };
}
