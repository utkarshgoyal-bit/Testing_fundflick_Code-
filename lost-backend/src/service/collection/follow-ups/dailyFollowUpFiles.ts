import moment from 'moment';
import { Types } from 'mongoose';
import { searchQuery } from '../../../../src/interfaces/';
import { COMMIT_STATUS_ORDER } from '../../../shared/enums';
import { isTrue } from '../../../helper';
import FollowUpData from '../../../models/collection/followUpData';
import checkPermission from '../../../lib/permissions/checkPermission';
import { PERMISSIONS } from '../../../shared/enums/permissions';
import isSuperAdmin from '../../../helper/booleanCheck/isSuperAdmin';

const getDailyFollowUpReport = async ({
  searchQuery,
  loginUser,
  limit,
}: {
  searchQuery: searchQuery;
  loginUser: any;
  limit?: number;
}) => {
  try {
    const matchStage: any = {
      organization: loginUser.organization._id,
    };
    if (searchQuery.createdBy) {
      matchStage.createdBy = {
        $in: Array.isArray(searchQuery.createdBy)
          ? searchQuery.createdBy.map(id => new Types.ObjectId(id))
          : [new Types.ObjectId(searchQuery.createdBy)],
      };
    }
    if (searchQuery.type && searchQuery.type === 'commit') {
      if (!!searchQuery?.startDate && !!searchQuery?.endDate) {
        const start = moment(searchQuery?.startDate).startOf('day').toDate();
        const end = moment(searchQuery?.endDate).endOf('day').toDate();
        matchStage.commit = {
          $gte: start,
          $lte: end,
        };
      }
    } else {
      if (!!searchQuery?.startDate && !!searchQuery?.endDate) {
        const start = new Date(searchQuery?.startDate || new Date());
        start.setHours(0, 0, 0, 0);
        const end = new Date(searchQuery?.endDate || new Date());
        end.setHours(23, 59, 59, 999);
        matchStage.createdAt = {
          $gte: start,
          $lte: end,
        };
      }
    }

    if (searchQuery.attitude) {
      matchStage.attitude = searchQuery.attitude;
    }
    if (searchQuery.visitType) {
      matchStage.visitType = searchQuery.visitType;
    }
    let caseConditionsQuery: any = {};
    if (searchQuery.caseId) {
      caseConditionsQuery = {
        ...caseConditionsQuery,
        'refCaseId.caseNo': { $regex: new RegExp(searchQuery.caseId, 'i') },
      };
    }
    const _isSuperAdmin = isSuperAdmin([loginUser?.role || '']);
    const [_isBranchView, _isAssignedView] = await Promise.all([
      checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_DAILY_FOLLOWUPS_BRANCH_WISE),
      checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_DAILY_FOLLOWUPS_ASSIGNED),
    ]);

    const caseConditionsQueryOr: any[] = [];
    if (_isBranchView && loginUser.branches && loginUser.branches.length > 0 && !_isSuperAdmin) {
      caseConditionsQueryOr.push({ 'refCaseId.area': { $in: loginUser.branches } });
    }
    if (_isAssignedView && !_isSuperAdmin) {
      caseConditionsQueryOr.push({
        'refCaseId.assignedTo': new Types.ObjectId(loginUser.employeeId),
      });
    }

    if (caseConditionsQueryOr.length > 0) {
      caseConditionsQuery.$or = caseConditionsQueryOr;
    }

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'collection_case_payments',
          let: {
            caseNo: '$caseNo',
            commitDate: '$commit',
            createdDate: '$createdAt',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$caseNo', '$$caseNo'],
                    },
                    {
                      $lte: [
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$date',
                          },
                        },
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$$commitDate',
                          },
                        },
                      ],
                    },
                    {
                      $gte: [
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$date',
                          },
                        },
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$$createdDate',
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: 'matchedPayments',
        },
      },
      {
        $lookup: {
          from: 'collection_case_followups',
          let: {
            caseNo: '$caseNo',
            commit: '$commit',
            currentId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$caseNo', '$$caseNo'],
                    },
                    {
                      $gte: ['$commit', '$$commit'],
                    },
                    { $ne: ['$_id', '$$currentId'] },
                  ],
                },
              },
            },
          ],
          as: 'recentFollowups',
        },
      },
      {
        $addFields: {
          commitStatus: {
            $switch: {
              branches: [
                {
                  case: {
                    $gt: [{ $size: '$matchedPayments' }, 0],
                  },
                  then: COMMIT_STATUS_ORDER.fulfilled,
                },
                {
                  case: {
                    $gte: [
                      '$commit',
                      {
                        $dateFromParts: {
                          year: { $year: '$$NOW' },
                          month: { $month: '$$NOW' },
                          day: {
                            $dayOfMonth: '$$NOW',
                          },
                        },
                      },
                    ],
                  },
                  then: COMMIT_STATUS_ORDER.pending,
                },
              ],
              default: COMMIT_STATUS_ORDER.expired,
            },
          },
        },
      },
      {
        $sort: {
          COMMIT_STATUS_ORDER: -1,
        },
      },
      {
        $addFields: {
          idle: {
            $cond: {
              if: {
                $and: [
                  {
                    $eq: [{ $size: '$matchedPayments' }, 0],
                  },
                  {
                    $eq: [{ $size: '$recentFollowups' }, 0],
                  },
                  { $lt: ['$commit', '$$NOW'] },
                  {
                    $eq: ['$commitStatus', 'expired'],
                  },
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      { $match: matchStage },
      {
        $lookup: {
          from: 'collection_cases',
          localField: 'caseNo',
          foreignField: 'caseNo',

          as: 'refCaseId',
        },
      },
      {
        $lookup: {
          from: 'collection_case_payments',
          localField: 'caseNo',
          foreignField: 'caseNo',
          as: 'collectionData',
        },
      },
      { $unwind: { path: '$refCaseId', preserveNullAndEmptyArrays: true } },
      { $match: caseConditionsQuery },
      {
        $match: {
          'refCaseId.dueEmi': { $gt: 0 },
          'refCaseId.dueEmiAmount': { $gt: 0 },
          ...(searchQuery?.branch?.length
            ? {
                'refCaseId.area': {
                  $in: Array.isArray(searchQuery.branch)
                    ? searchQuery.branch
                    : searchQuery.branch.split(','),
                },
              }
            : {}),
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
    ];

    if (isTrue(searchQuery.export)) {
      pipeline.push({
        $project: {
          createdAt: 1,
          caseNo: '$refCaseId.caseNo',
          customer: '$refCaseId.customer',
          attitude: 1,
          commit: 1,
          remarks: 1,
          visitType: 1,
          followUpBy: {
            $concat: ['$createdBy.firstName', ' ', '$createdBy.lastName'],
          },
          contact: { $ifNull: ['$refCaseId.contactNo', []] },
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

    const data = await FollowUpData.aggregate(pipeline).sort({ createdAt: -1 });
    const total = await FollowUpData.aggregate([...pipeline.slice(0, -2), { $count: 'count' }]);

    return { data, total: total.length > 0 ? total[0].count : 0 };
  } catch (error) {
    console.error('Error in getDailyFollowUpReport:', error);
    throw error;
  }
};
export default getDailyFollowUpReport;
