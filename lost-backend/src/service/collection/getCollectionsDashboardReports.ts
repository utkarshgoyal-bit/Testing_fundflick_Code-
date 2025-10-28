import CollectionModel from "../../models/collection/dataModel";

const getCollectionsReports = async ({ loginUser }: { loginUser: any }) => {
  const followupsReportsPipeline = [
    {
      $match: {
        organization: loginUser.organization._id,
        followUps: { $size: 0 },
        $expr: {
          $or: [
            {
              $and: [{ $ne: ["$dueEmi", null] }, { $ne: ["$dueEmi", 0] }],
            },
            {
              $and: [{ $ne: ["$dueEmiAmount", null] }, { $ne: ["$dueEmiAmount", 0] }],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$area",
        totalCases: { $sum: 1 },
        cases: {
          $push: {
            caseNo: "$caseNo",
            customer: "$customer",
            overdue: "$overdue",
            address: "$address",
            dueEmi: "$dueEmi",
            dueEmiAmount: "$dueEmiAmount",
            followups: "$followUps",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        area: "$_id",
        totalCases: 1,
        cases: 1,
      },
    },
  ];

  const collectionReportsPipeline = [
    {
      $match: {
        organization: loginUser.organization._id,
      },
    },
    {
      $lookup: {
        from: "collection_case_payments",
        localField: "paymentDetails",
        foreignField: "_id",
        as: "paymentDetails",
      },
    },
    {
      $addFields: {
        totalPaid: {
          $sum: "$paymentDetails.amount",
        },
      },
    },
    {
      $group: {
        _id: "$area",
        pendingCases: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $and: [{ $ne: ["$dueEmi", null] }, { $ne: ["$dueEmi", 0] }],
                  },
                  {
                    $and: [{ $ne: ["$dueEmiAmount", null] }, { $ne: ["$dueEmiAmount", 0] }],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        resolvedCases: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $or: [{ $eq: ["$dueEmi", null] }, { $eq: ["$dueEmi", 0] }],
                  },
                  {
                    $or: [{ $eq: ["$dueEmiAmount", null] }, { $eq: ["$dueEmiAmount", 0] }],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        totalPaid: { $sum: "$totalPaid" },
        totalDue: { $sum: "$dueEmiAmount" },
      },
    },
    {
      $addFields: {
        totalCases: { $add: ["$pendingCases", "$resolvedCases"] },
        resolvedPercentage: {
          $cond: [
            { $eq: [{ $add: ["$pendingCases", "$resolvedCases"] }, 0] },
            0,
            {
              $round: [
                {
                  $multiply: [{ $divide: ["$resolvedCases", { $add: ["$pendingCases", "$resolvedCases"] }] }, 100],
                },
                2,
              ],
            },
          ],
        },
        collectionPercentage: {
          $cond: [
            { $eq: [{ $add: ["$totalPaid", "$totalDue"] }, 0] },
            0,
            {
              $round: [
                {
                  $multiply: [{ $divide: ["$totalPaid", { $add: ["$totalPaid", "$totalDue"] }] }, 100],
                },
                2,
              ],
            },
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        area: "$_id",
        pendingCases: 1,
        resolvedCases: 1,
        totalCases: 1,
        resolvedPercentage: 1,
        collectionPercentage: 1,
      },
    },
  ];

  const collectionStatesPipeline = [
    {
      $match: {
        organization: loginUser.organization._id,
      },
    },
    {
      $lookup: {
        from: "collection_follow_ups",
        localField: "followUps",
        foreignField: "_id",
        as: "followUps",
      },
    },
    {
      $lookup: {
        from: "collection_case_payments",
        localField: "paymentDetails",
        foreignField: "_id",
        as: "paymentDetails",
      },
    },
    {
      $facet: {
        totalDue: [
          {
            $group: {
              _id: null,
              totalAmountDue: { $sum: "$overdue" },
            },
          },
        ],
        ptp: [
          {
            $match: {
              organization: loginUser.organization._id,
              $and: [{ "followUps.commit": { $gt: new Date().toISOString() } }, { "followUps.dueAmount": { $gt: 0 } }],
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ],
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
        totalCollections: [
          { $unwind: { path: "$paymentDetails", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: null,
              totalCollections: { $sum: "$paymentDetails.amount" },
            },
          },
        ],
        statusStats: [
          {
            $group: {
              _id: "$_id", // group by document _id to deduplicate post-lookup
              dueEmi: { $first: "$dueEmi" },
              dueEmiAmount: { $first: "$dueEmiAmount" },
            },
          },
          {
            $group: {
              _id: null,
              pendingCases: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $and: [{ $ne: ["$dueEmi", null] }, { $ne: ["$dueEmi", 0] }] },
                        { $and: [{ $ne: ["$dueEmiAmount", null] }, { $ne: ["$dueEmiAmount", 0] }] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              resolvedCases: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $eq: ["$dueEmi", null] },
                        { $eq: ["$dueEmi", 0] },
                        { $eq: ["$dueEmiAmount", null] },
                        { $eq: ["$dueEmiAmount", 0] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalAmountDue: { $ifNull: [{ $arrayElemAt: ["$totalDue.totalAmountDue", 0] }, 0] },
        totalCollections: { $ifNull: [{ $arrayElemAt: ["$totalCollections.totalCollections", 0] }, 0] },
        pendingCases: { $ifNull: [{ $arrayElemAt: ["$statusStats.pendingCases", 0] }, 0] },
        resolvedCases: { $ifNull: [{ $arrayElemAt: ["$statusStats.resolvedCases", 0] }, 0] },
        loanTypeSummary: 1,
      },
    },
  ];

  const stageWiseReportPipeline = [
    { $match: { organization: loginUser.organization._id } },
    // 1. Lookup follow-ups and payments
    {
      $lookup: {
        from: "collection_case_followups",
        localField: "followUps",
        foreignField: "_id",
        as: "followUps",
      },
    },
    {
      $lookup: {
        from: "collection_case_payments",
        localField: "paymentDetails",
        foreignField: "_id",
        as: "paymentDetails",
      },
    },

    // 3. Categorize past/future followUps
    {
      $addFields: {
        futureFollowUps: {
          $filter: {
            input: "$followUps",
            as: "f",
            cond: { $gte: ["$$f.commit", "$$NOW"] },
          },
        },
        pastFollowUps: {
          $filter: {
            input: "$followUps",
            as: "f",
            cond: { $lt: ["$$f.commit", "$$NOW"] },
          },
        },
      },
    },

    // 4. Find latest past PTP
    {
      $addFields: {
        lastPTPDate: {
          $let: {
            vars: {
              commits: {
                $map: {
                  input: "$pastFollowUps",
                  as: "f",
                  in: "$$f.commit",
                },
              },
            },
            in: {
              $cond: [{ $gt: [{ $size: "$$commits" }, 0] }, { $max: "$$commits" }, null],
            },
          },
        },
      },
    },

    // 5. Payments after lastPTP
    {
      $addFields: {
        paymentsAfterLastPTP: {
          $filter: {
            input: "$paymentDetails",
            as: "p",
            cond: {
              $cond: [{ $eq: ["$lastPTPDate", null] }, false, { $gt: ["$$p.date", "$lastPTPDate"] }],
            },
          },
        },
      },
    },

    // 6. Classification flags
    {
      $addFields: {
        isBrokenPTP: {
          $and: [
            { $eq: [{ $size: "$futureFollowUps" }, 0] },
            { $gt: ["$dueEmiAmount", 0] },
            { $eq: [{ $size: "$paymentsAfterLastPTP" }, 0] },
          ],
        },
        isFuturePTP: { $gt: [{ $size: "$futureFollowUps" }, 0] },
        hasPayment: { $gt: [{ $size: "$paymentDetails" }, 0] },
        futureFollowUpsCount: {
          $cond: {
            if: { $isArray: "$futureFollowUps" },
            then: { $size: "$futureFollowUps" },
            else: 0,
          },
        },
      },
    },

    // 7. Assign `stage`
    {
      $addFields: {
        stage: {
          $switch: {
            branches: [
              // ✅ Completed
              {
                case: {
                  $or: [{ $eq: ["$dueEmi", 0] }, { $eq: ["$dueEmiAmount", 0] }],
                },
                then: "completed",
              },
              // ✅ Pending
              {
                case: {
                  $and: [
                    { $gt: ["$dueEmi", 0] },
                    { $gt: ["$dueEmiAmount", 0] },
                    { $gt: [{ $size: "$futureFollowUps" }, 0] },
                  ],
                },
                then: "pending",
              },
              // ✅ Partially Paid
              {
                case: {
                  $and: [
                    { $gt: ["$dueEmi", 0] },
                    { $gt: ["$dueEmiAmount", 0] },
                    { $gt: [{ $size: "$paymentDetails" }, 0] },
                    {
                      $gt: [
                        {
                          $size: {
                            $filter: {
                              input: "$futureFollowUps",
                              as: "f",
                              cond: { $gt: ["$$f.commit", { $max: "$paymentDetails.date" }] },
                            },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "partiallyPaid",
              },
              // ✅ Expired
              {
                case: {
                  $and: [
                    { $eq: [{ $size: "$futureFollowUps" }, 0] },
                    { $eq: [{ $size: "$paymentsAfterLastPTP" }, 0] },
                    { $gt: ["$dueEmi", 0] },
                    { $gt: ["$dueEmiAmount", 0] },
                  ],
                },
                then: "expired",
              },
            ],
            default: "unknown",
          },
        },
      },
    },

    // 8. Group for final summary
    {
      $group: {
        _id: "$stage",
        count: { $sum: 1 },
        totalDueAmount: { $sum: "$dueEmiAmount" },
        brokenPTPCount: {
          $sum: { $cond: ["$isBrokenPTP", 1, 0] },
        },
        brokenPTPAmount: {
          $sum: { $cond: ["$isBrokenPTP", "$dueEmiAmount", 0] },
        },
        ptpAmount: {
          $sum: { $cond: ["$isFuturePTP", "$dueEmiAmount", 0] },
        },
        totalFutureFollowUps: { $sum: "$futureFollowUpsCount" },
      },
    },

    // 9. Reshape as combined output
    {
      $group: {
        _id: null,
        stages: {
          $push: {
            stage: "$_id",
            count: "$count",
            totalDueAmount: "$totalDueAmount",
          },
        },
        brokenPTPCount: { $sum: "$brokenPTPCount" },
        brokenPTPAmount: { $sum: "$brokenPTPAmount" },
        ptpAmount: { $sum: "$ptpAmount" },
        totalFutureFollowUps: { $sum: "$totalFutureFollowUps" },
      },
    },
    {
      $project: {
        _id: 0,
        stages: 1,
        brokenPTPCount: 1,
        brokenPTPAmount: 1,
        ptpAmount: 1,
        totalFutureFollowUps: 1,
      },
    },
  ];
  const [collectionReportsData, followUpsReportsData, statesData, stageWiseReportData] = await Promise.all([
    CollectionModel.aggregate(collectionReportsPipeline),
    CollectionModel.aggregate(followupsReportsPipeline),
    CollectionModel.aggregate(collectionStatesPipeline),
    CollectionModel.aggregate(stageWiseReportPipeline),
  ]);

  return {
    collectionReportsData,
    followUpsReportsData,
    statesData: statesData[0] ?? {},
    stageWiseReportData: stageWiseReportData[0] ?? {},
  };
};

export default getCollectionsReports;
