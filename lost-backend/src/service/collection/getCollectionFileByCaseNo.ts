import { LoginUser } from '../../interfaces';
import CollectionModel from '../../schema/collection/dataModel';
import FollowUpData from '../../schema/collection/followUpData';
import PaymentData from '../../schema/collection/payment';
import FollowUpDataRevisions from '../../schema/collectionRevisions/followUpData';
import PaymentDataRevisions from '../../schema/collectionRevisions/payment';
const getCollectionFileByCaseNo = async ({
  caseNo,
  loginUser,
}: {
  caseNo: string;
  loginUser: LoginUser;
}) => {
  try {
    const caseRecord = await CollectionModel.findOne({
      caseNo,
      organization: loginUser.organization._id,
    })
      .populate('assignedTo')
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
            from: 'employeesv2',
            localField: 'employeeId',
            foreignField: '_id',
            as: 'followedBy',
          },
        },
        {
          $project: {
            followedBy: {
              $map: {
                input: '$followedBy',
                as: 'employee',
                in: {
                  firstname: '$$employee.firstName',
                  lastname: '$$employee.lastName',
                  email: '$$employee.email',
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
            from: 'employeesv2',
            localField: 'employeeId',
            foreignField: '_id',
            as: 'followedBy',
          },
        },
        {
          $project: {
            followedBy: {
              $map: {
                input: '$followedBy',
                as: 'employee',
                in: {
                  firstname: '$$employee.firstName',
                  lastname: '$$employee.lastName',
                  email: '$$employee.email',
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
      const [followUpData, revisionFollowUpData, paymentsData, revisionPaymentsData] =
        await Promise.all([
          FollowUpData.aggregate(followUpDataPipeline),
          FollowUpDataRevisions.aggregate(followUpDataPipeline),
          PaymentData.aggregate(paymentDataPipeline),
          PaymentDataRevisions.aggregate(paymentDataPipeline),
        ]);
      const allFollowUpData = [...followUpData, ...revisionFollowUpData];
      const allPaymentData = [...paymentsData, ...revisionPaymentsData];

      return {
        ...caseRecord,
        followUpData: allFollowUpData.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }),
        paymentsData: allPaymentData.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }),
      };
    }
    return null;
  } catch {
    throw new Error('An error occurred while fetching the case record.');
  }
};
export default getCollectionFileByCaseNo;
