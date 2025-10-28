import { PipelineStage, Types } from "mongoose";
import { isTrue } from "../../../helper";
import CollectionModel from "../../../models/collection/dataModel";
import checkPermission from "../../../lib/permissions/checkPermission";
import { PERMISSIONS } from "../../../shared/enums/permissions";
import isSuperAdmin from "../../../helper/booleanCheck/isSuperAdmin";
const getCases = async ({ loginUser, query: queryData }: { loginUser: any; query: { [key: string]: any } }) => {
  try {
    let { page, filters, limit, includeFullyPaidCollection = "" } = queryData;
    const isIncludeFullyPaidCollection = isTrue(includeFullyPaidCollection);
    let query: any = {
      ...(!isIncludeFullyPaidCollection && {
        dueEmiAmount: { $nin: [null, 0] },
        dueEmi: { $nin: [null, 0] },
      }),
      expired: false,
      organization: loginUser.organization._id,
      dueEmi: { $gte: 1 },
    };
    if (filters) {
      filters = JSON.parse(filters);
    }
    if (filters.dueEmi) {
      if (filters.dueEmi.start !== undefined && filters.dueEmi.end !== undefined) {
        query.dueEmi = {
          $gte: Number(filters.dueEmi.start),
          $lte: Number(filters.dueEmi.end),
        };
      } else {
        if (filters.dueEmi == "0") {
          query = { ...query, dueEmi: { $eq: 0 } };
        } else if (filters.dueEmi == "1-3") {
          query = { ...query, dueEmi: { $gte: 1, $lte: 3 } };
        } else if (filters.dueEmi == "3-6") {
          query = { ...query, dueEmi: { $gte: 4, $lte: 6 } };
        } else {
          query = { ...query, dueEmi: { $ne: 0 } };
        }
      }
    }
    if (filters.branch && filters.branch.length > 0) {
      query.area = { $in: filters.branch };
    }
    if (filters.loanType) {
      query.loanType = { $in: filters.loanType };
    }

    if (filters.lastPaymentDetail?.start && filters.lastPaymentDetail?.end) {
      const startDate = new Date(filters.lastPaymentDetail.start);
      const endDate = new Date(filters.lastPaymentDetail.end);
      query.$expr = {
        $and: [
          {
            $gte: [
              {
                $dateFromString: {
                  dateString: {
                    $trim: {
                      input: {
                        $arrayElemAt: [{ $split: ["$lastPaymentDetail", "("] }, 0],
                      },
                      chars: " ",
                    },
                  },
                },
              },
              startDate,
            ],
          },
          {
            $lte: [
              {
                $dateFromString: {
                  dateString: {
                    $trim: {
                      input: {
                        $arrayElemAt: [{ $split: ["$lastPaymentDetail", "("] }, 0],
                      },
                      chars: " ",
                    },
                  },
                },
              },
              endDate,
            ],
          },
        ],
      };
    }
    const [_isCollectionAreaView, _isCollectionAssignedView, _isCollectionSelfView, _isCollectionOtherView] =
      await Promise.all([
        checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_AREA),
        checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_ASSIGNED),
        checkPermission(loginUser, PERMISSIONS.COLLECTION_ASSIGN_CASE),
        checkPermission(loginUser, PERMISSIONS.COLLECTION_VIEW_OTHER),
      ]);
    const _isSuperAdmin = isSuperAdmin([loginUser?.role || ""]);

    if (_isCollectionSelfView && !_isCollectionOtherView && !_isSuperAdmin) {
      query.assignedTo = new Types.ObjectId(loginUser.employeeId);
    }

    if (_isCollectionAssignedView && !_isCollectionOtherView && !_isSuperAdmin) {
      query.assignedTo = new Types.ObjectId(loginUser.employeeId);
    }

    if (_isCollectionAreaView && !_isCollectionOtherView && !_isSuperAdmin) {
      if (loginUser.branches && loginUser.branches.length > 0) {
        query.area = { $in: loginUser?.branches };
      }
    }

    if (filters.search) {
      query = {
        ...query,
        $or: [
          { caseNo: { $regex: filters.search, $options: "i" } },
          { customer: { $regex: filters.search, $options: "i" } },
        ],
      };
    }

    const caseCollectionStatus: PipelineStage[] = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: "collection_case_followups",
          localField: "_id",
          foreignField: "refCaseId",
          as: "followUps",
        },
      },
      {
        $lookup: {
          from: "collection_case_payments",
          localField: "_id",
          foreignField: "refCaseId",
          as: "payments",
        },
      },
      {
        $addFields: {
          today: new Date(),
          upcomingP2P: {
            $filter: {
              input: "$followUps",
              as: "f",
              cond: {
                $gte: ["$$f.commit", new Date().setHours(0, 0, 0, 0)],
              },
            },
          },
          recentP2P: {
            $filter: {
              input: "$followUps",
              as: "f",
              cond: {
                $and: [
                  { $lte: ["$$f.commit", new Date()] },
                  {
                    $gte: ["$$f.commit", { $subtract: [new Date(), 1000 * 60 * 60 * 24 * 3] }],
                  },
                ],
              },
            },
          },
          recentPayments: {
            $filter: {
              input: "$payments",
              as: "p",
              cond: {
                $gte: ["$$p.date", { $subtract: [new Date(), 1000 * 60 * 60 * 24 * 3] }],
              },
            },
          },
        },
      },
      {
        $addFields: {
          collectionStatus: {
            $switch: {
              branches: [
                {
                  case: { $gt: ["$dueEmiAmount", 0] },
                  then: "Due Payment",
                },
                {
                  case: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$payments",
                            as: "p",
                            cond: {
                              $in: [
                                "$$p.date",
                                {
                                  $map: {
                                    input: "$followUps",
                                    as: "f",
                                    in: "$$f.commit",
                                  },
                                },
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                  then: "Paid",
                },
                {
                  case: {
                    $and: [{ $eq: [{ $size: "$recentP2P" }, 0] }, { $eq: [{ $size: "$recentPayments" }, 0] }],
                  },
                  then: "Expired",
                },
              ],
              default: "Due Payment",
            },
          },
        },
      },
      {
        $lookup: {
          from: "Employeesv2",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
        },
      },
      {
        $facet: {
          data: [{ $sort: { caseNo: 1 } }, { $skip: (+page || 0) * (+limit || 10) }, { $limit: +limit || 10 }],
          total: [{ $count: "count" }],
          completedCases: [{ $match: { $or: [{ dueEmi: 0 }, { dueEmi: null }] } }, { $count: "count" }],
          loanTypeSummary: [
            {
              $group: {
                _id: "$loanType",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                loanType: "$_id",
                count: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$total",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    let data = [];
    let branches = [];

    try {
      [data, branches] = await Promise.all([
        CollectionModel.aggregate(caseCollectionStatus),
        CollectionModel.aggregate([
          { $match: { organization: loginUser.organization._id } },
          { $group: { _id: "$area" } },
        ]),
      ]);
    } catch (error) {
      console.error(error);
      branches = [];
      data = [];
    }
    return {
      data: data?.[0]?.data || [],
      total: data?.[0]?.total?.count || 0,
      completedCases: data?.[0]?.completedCases?.[0]?.count || 0,
      loanTypeSummary: data?.[0]?.loanTypeSummary || [],
      branches: branches
        .filter(({ _id }) => _id)
        .map(({ _id }: { _id: string }) => ({
          item: _id,
          value: _id,
          label: _id.toUpperCase(),
        })),
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default getCases;
