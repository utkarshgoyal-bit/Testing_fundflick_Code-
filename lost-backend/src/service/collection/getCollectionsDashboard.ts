import moment from "moment";
import { Types } from "mongoose";
import { isTrue } from "../../helper";
import dateOffset from "../../helper/dateOffSet";
import getDateString from "../../helper/getDateString";
import checkPermission from "../../lib/permissions/checkPermission";
import CollectionModel from "../../models/collection/dataModel";
import FollowUpData from "../../models/collection/followUpData";
import { PERMISSIONS } from "../../shared/enums/permissions";
import getDailyFollowUpReport from "./follow-ups/dailyFollowUpFiles";
import getDailyPaymentsReport from "./payment/dailyPaymentFiles";
import isSuperAdmin from "../../helper/booleanCheck/isSuperAdmin";
const getCollections = async ({
  loginUser,
  filters,
}: {
  loginUser: any;
  filters: {
    followupDay: "today" | "yesterday" | "tomorrow";
    collectionDay: "today" | "yesterday" | "tomorrow";
    includeFullyPaidCollection: boolean;
    branch?: string | string[];
  };
}) => {
  (Object.keys(filters) as (keyof typeof filters)[]).forEach((key) => {
    if (filters[key] === undefined || filters[key] === "undefined" || filters[key] === "" || filters[key] === null) {
      delete filters[key];
    }
  });
  if (filters.branch && !Array.isArray(filters.branch)) {
    filters.branch = filters.branch.split(",");
  }
  const collectionDay = getDateString(dateOffset(filters.collectionDay));
  const followupDay = getDateString(dateOffset(filters.followupDay));
  const { includeFullyPaidCollection = false } = filters;
  const isIncludeFullyPaidCollection = isTrue(includeFullyPaidCollection);
  const [_isCollectionViewAssigned, _isCollectionViewArea] = await Promise.all([
    checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_ASSIGNED),
    checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_AREA),
  ]);
  const _isSuperAdmin = isSuperAdmin([loginUser?.role || ""]);

  const assignedQuery =
    _isCollectionViewAssigned && !_isSuperAdmin ? { assignedTo: new Types.ObjectId(loginUser.employeeId) } : {};

  const areaQuery = _isCollectionViewArea && !_isSuperAdmin ? { area: { $in: loginUser?.branches } } : {};

  const followUpQuery =
    _isCollectionViewAssigned && !_isSuperAdmin
      ? { "refCaseId.assignedTo": new Types.ObjectId(loginUser.employeeId) }
      : {};

  const followUpAreaQuery =
    _isCollectionViewArea && !_isSuperAdmin ? { "refCaseId.area": { $in: loginUser?.branches } } : {};

  const branchQuery = filters.branch?.length ? { "refCaseId.area": { $in: filters.branch } } : {};

  const collectionEfficiencyAmountPipeline = [
    {
      $match: {
        expired: false,
        $or: [assignedQuery, areaQuery],
        ...(filters.branch?.length && { area: { $in: filters.branch } }),
        organization: loginUser.organization._id,
      },
    },
    {
      $lookup: {
        from: "collection_case_payments",
        localField: "caseNo",
        foreignField: "caseNo",
        as: "payments",
      },
    },
    {
      $addFields: {
        totalPaidAmount: {
          $sum: "$payments.amount",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalDueEmiAmount: { $sum: "$dueEmiAmount" },
        totalPaidAmount: { $sum: "$totalPaidAmount" },
      },
    },
    {
      $project: {
        _id: 0,
        totalDueEmiAmount: 1,
        paidAmount: "$totalPaidAmount",
      },
    },
  ];
  const followUpEfficiencyCasePipeline = [
    {
      $match: {
        organization: loginUser.organization._id,
      },
    },
    {
      $lookup: {
        from: "collection_cases",
        localField: "refCaseId",
        foreignField: "_id",
        as: "refCaseId",
      },
    },
    {
      $unwind: {
        path: "$refCaseId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "refCaseId.expired": false,
        $or: [followUpQuery, followUpAreaQuery],
        ...branchQuery,
      },
    },
    {
      $project: {
        _id: 0,
        caseNo: "$refCaseId.caseNo",
        noReply: "$refCaseId.noReply",
      },
    },
    {
      $group: {
        _id: null,
        totalFollowUps: { $sum: 1 },
        totalNoReply: {
          $sum: {
            $cond: [{ $eq: ["$noReply", true] }, 1, 0],
          },
        },
      },
    },
  ];
  const [followUps, payments, CollectionEfficiencyAmount, CollectionEfficiencyCaseWise, FollowupEfficiencyCase] =
    await Promise.all([
      getDailyFollowUpReport({
        loginUser,
        searchQuery: {
          type: "commit",
          startDate: moment(followupDay).startOf("day").toDate(),
          endDate: moment(followupDay).endOf("day").toDate(),
          branch: filters.branch,
        },
        limit: 5,
      }),
      getDailyPaymentsReport({
        loginUser,
        searchQuery: {
          startDate: moment(collectionDay).startOf("day").toDate(),
          endDate: moment(collectionDay).endOf("day").toDate(),
          page: "0",
          branch: filters.branch,
        },
        limit: 5,
      }),
      await CollectionModel.aggregate(collectionEfficiencyAmountPipeline),
      [
        {
          completed:
            (await CollectionModel.countDocuments({
              expired: false,
              organization: loginUser.organization._id,
              $or: [assignedQuery, areaQuery],
              ...(filters.branch?.length && { area: { $in: filters.branch } }),
            })) -
            (await CollectionModel.countDocuments({
              dueEmi: { $gt: 0 },
              dueEmiAmount: { $gt: 0 },
              expired: false,
              organization: loginUser.organization._id,
              $or: [assignedQuery, areaQuery],
              ...(filters.branch?.length && { area: { $in: filters.branch } }),
            })),
          pending: await CollectionModel.countDocuments({
            dueEmi: { $gt: 0 },
            dueEmiAmount: { $gt: 0 },
            expired: false,
            organization: loginUser.organization._id,
            $or: [assignedQuery, areaQuery],
            ...(filters.branch?.length && { area: { $in: filters.branch } }),
          }),
        },
      ],
      await FollowUpData.aggregate(followUpEfficiencyCasePipeline),
    ]);
  const totalCases = await CollectionModel.find({
    ...(!isIncludeFullyPaidCollection && { dueEmiAmount: { $nin: [null, 0] }, dueEmi: { $nin: [null, 0] } }),
    expired: false,
    $or: [assignedQuery, areaQuery],
    ...(filters.branch?.length && { area: { $in: filters.branch } }),
    organization: loginUser.organization._id,
  }).countDocuments();
  const getAllCollectionFiles = await CollectionModel.aggregate([
    {
      $match: {
        expired: false,
        followUps: {
          $ne: [],
        },
        $or: [assignedQuery, areaQuery],
        ...(filters.branch?.length && { area: { $in: filters.branch } }),
        organization: loginUser.organization._id,
      },
    },
    {
      $lookup: {
        from: "collection_case_followups",
        localField: "followUps",
        foreignField: "_id",
        as: "followUpsData",
      },
    },
    {
      $project: {
        caseNo: 1,
        followUpsData: 1,
      },
    },
  ]);
  const total = payments?.data?.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0) || 0;
  const todaysPromises = followUps || 0;

  return {
    todaysPromises,
    todaysCollection: { data: payments?.data, total },
    CollectionEfficiencyAmount,
    CollectionEfficiencyCaseWise,
    FollowupEfficiencyCase,
    totalUpcomingCollectionFilesCount: getAllCollectionFiles?.length,
    totalCases,
    getAllCollectionFiles,
  };
};
export default getCollections;
