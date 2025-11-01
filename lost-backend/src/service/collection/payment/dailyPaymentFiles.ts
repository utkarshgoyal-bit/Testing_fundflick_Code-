import { Types } from 'mongoose';
import { LoginUser, searchQueryPayment } from '../../../../src/interfaces/';
import { isTrue } from '../../../helper';
import isSuperAdmin from '../../../helper/booleanCheck/isSuperAdmin';
import checkPermission from '../../../lib/permissions/checkPermission';
import PaymentData from '../../../schema/collection/payment';
import { PERMISSIONS } from '../../../shared/enums/permissions';
const getDailyPaymentsReport = async ({
  searchQuery,
  loginUser,
  limit,
}: {
  searchQuery: searchQueryPayment;
  loginUser: LoginUser;
  limit?: number;
}) => {
  const _isSuperAdmin = isSuperAdmin([loginUser?.role || '']);
  const [
    _isCollectionViewBranchWise,
    _isCollectionViewAssigned,
    _isCollectionDailyPaymentAccess,
    _isCollectionDailyPaymentViewOther,
  ] = await Promise.all([
    checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_DAILY_PAYMENTS_BRANCH),
    checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_DAILY_PAYMENTS_ASSIGNED),
    checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_DAILY_PAYMENTS),
    checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_DAILY_PAYMENTS_OTHERS),
  ]);
  if (!_isSuperAdmin && !_isCollectionDailyPaymentAccess) {
    return [];
  }
  const matchStage: any = {
    organization: loginUser.organization._id,
  };
  if (!!searchQuery?.startDate && !!searchQuery?.endDate) {
    const start = new Date(searchQuery?.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(searchQuery?.endDate);
    end.setHours(23, 59, 59, 999);
    matchStage.date = {
      $gte: start,
      $lte: end,
    };
  }

  if (searchQuery.paymentMode) {
    matchStage.paymentMode = searchQuery.paymentMode;
  }
  let caseConditionsQuery: { [key: string]: unknown } = {};
  if (searchQuery.caseNo) {
    caseConditionsQuery = {
      ...caseConditionsQuery,
      'refCaseId.caseNo': { $regex: new RegExp(searchQuery.caseNo, 'i') },
    };
  }

  const caseConditionsQueryOr: { [key: string]: unknown }[] = [];

  if (_isCollectionViewBranchWise && !_isSuperAdmin) {
    caseConditionsQueryOr.push({
      'refCaseId.area': {
        $in: loginUser.branches.length > 0 ? loginUser.branches : ['__NO_BRANCH__'],
      },
    });
  }
  if (_isCollectionViewAssigned && !_isSuperAdmin) {
    caseConditionsQueryOr.push({
      'refCaseId.assignedTo': new Types.ObjectId(loginUser.employeeId),
    });
  }

  const permissionsQuery =
    _isCollectionDailyPaymentViewOther || _isSuperAdmin
      ? {}
      : caseConditionsQueryOr.length > 0
        ? { $or: caseConditionsQueryOr }
        : { _id: null };

  const pipeline: any[] = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'collection_cases',
        localField: 'refCaseId',
        foreignField: '_id',
        as: 'refCaseId',
      },
    },
    { $unwind: { path: '$refCaseId', preserveNullAndEmptyArrays: true } },
    { $match: { ...caseConditionsQuery, ...permissionsQuery } },
    {
      $match: {
        ...(searchQuery?.branch?.length && {
          'refCaseId.area': {
            $in: Array.isArray(searchQuery?.branch)
              ? searchQuery?.branch
              : searchQuery?.branch.split(','),
          },
        }),
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
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ];

  if (isTrue(searchQuery.export || false)) {
    pipeline.push({
      $project: {
        caseNo: '$refCaseId.caseNo',
        customer: '$refCaseId.customer',
        address: '$refCaseId.address',
        amount: 1,
        date: 1,
        extraCharges: 1,
        paymentMode: 1,
        remarks: 1,
        dateTimeStamp: 1,
        updatedAtTimeStamp: 1,
        updatedAt: 1,
        branchName: '$refCaseId.area',
        collectedBy: {
          $trim: {
            input: {
              $concat: [
                '$createdBy.firstName',
                ' ',
                {
                  $ifNull: ['$createdBy.lastName', ''],
                },
              ],
            },
          },
        },
      },
    });
    pipeline.push({
      $project: {
        _id: 0,
      },
    });
  } else {
    pipeline.push({ $skip: Number(searchQuery.page || 0) * 10 }, { $limit: limit || 10 });
  }

  const data = await PaymentData.aggregate(pipeline).sort({ createdAt: -1, commit: -1 });
  const total = await PaymentData.aggregate([
    ...pipeline.splice(0, pipeline.length - 2),
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        totalAmount: 1,
        count: 1,
      },
    },
  ]);

  return { data, total: total[0] || { count: 0, totalAmount: 0 } };
};

export default getDailyPaymentsReport;
