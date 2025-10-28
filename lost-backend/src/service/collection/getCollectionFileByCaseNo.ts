import CollectionModel from "../../models/collection/dataModel";
import FollowUpData from "../../models/collection/followUpData";
import PaymentData from "../../models/collection/payment";
import FollowUpDataRevisions from "../../models/collectionRevisions/followUpData";
import PaymentDataRevisions from "../../models/collectionRevisions/payment";
const getCollectionFileByCaseNo = async ({ caseNo, loginUser }: { caseNo: string; loginUser: any }) => {
  try {
    const caseRecord = await CollectionModel.findOne({ caseNo, organization: loginUser.organization._id })
      .populate("assignedTo")
      .lean();
    if (caseRecord) {
      const followUpDataPipeline = [
        {
          $match: {
            caseNo: caseNo,
            organization: loginUser.organization._id,
          },
        },
        {
          $lookup: {
            from: "employeesv2",
            localField: "employeeId",
            foreignField: "_id",
            as: "followedBy",
          },
        },
        {
          $project: {
            followedBy: {
              $map: {
                input: "$followedBy",
                as: "employee",
                in: {
                  firstname: "$$employee.firstName",
                  lastname: "$$employee.lastName",
                  email: "$$employee.email",
                },
              },
            },
            date: 1,
            commit: 1,
            visitType: 1,
            attitude: 1,
            remarks: 1,
            caseNo: 1,
            os: 1,
            createdAtTimeStamp: 1,
            updatedAtTimeStamp: 1,
            commitTimeStamp: 1,
            commitEndTimeStamp: 1,
            createdAt: 1,
          },
        },
      ];
      const paymentDataPipeline = [
        {
          $match: {
            caseNo: caseNo,
            organization: loginUser.organization._id,
          },
        },
        {
          $lookup: {
            from: "employeesv2",
            localField: "employeeId",
            foreignField: "_id",
            as: "followedBy",
          },
        },
        {
          $project: {
            followedBy: {
              $map: {
                input: "$followedBy",
                as: "employee",
                in: {
                  firstname: "$$employee.firstName",
                  lastname: "$$employee.lastName",
                  email: "$$employee.email",
                },
              },
            },
            date: 1,
            amount: 1,
            dateTimeStamp: 1,
            paymentMode: 1,
            attitude: 1,
            remarks: 1,
            os: 1,
            createdAtTimeStamp: 1,
            updatedAtTimeStamp: 1,
            commitTimeStamp: 1,
            commitEndTimeStamp: 1,
            extraCharges: 1,
            currencySymbol: 1,
          },
        },
      ];
      const [followUpData, revisionFollowUpData, paymentsData, revisionPaymentsData] = await Promise.all([
        FollowUpData.aggregate(followUpDataPipeline),
        FollowUpDataRevisions.aggregate(followUpDataPipeline),
        PaymentData.aggregate(paymentDataPipeline),
        PaymentDataRevisions.aggregate(paymentDataPipeline),
      ]);

      return {
        ...caseRecord,
        followUpData: [...followUpData, ...revisionFollowUpData],
        paymentsData: [...paymentsData, ...revisionPaymentsData],
      };
    }
    return null;
  } catch (error) {
    console.error("Error in fetchRecordByCaseNo:", error);
    throw new Error("An error occurred while fetching the case record.");
  }
};
export default getCollectionFileByCaseNo;
