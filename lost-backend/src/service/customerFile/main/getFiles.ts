import { Types } from "mongoose";
import CustomerFileSchema from "../../../models/customerFile";
import checkPermission from "../../../lib/permissions/checkPermission";
import { PERMISSIONS } from "../../../shared/enums/permissions";
import isSuperAdmin from "../../../helper/booleanCheck/isSuperAdmin";

const getFiles = async ({ loginUser, filters }: { loginUser: any; filters?: { [key: string]: any } }) => {
  let query: { [key: string]: any } = { ...filters, organization: loginUser.organization._id };
  const [_canViewSelf, _canViewOthers, _canViewBranch] = await Promise.all([
    checkPermission(loginUser, PERMISSIONS.CUSTOMER_FILE_VIEW_SELF),
    checkPermission(loginUser, PERMISSIONS.CUSTOMER_FILE_VIEW_OTHERS),
    checkPermission(loginUser, PERMISSIONS.CUSTOMER_FILE_VIEW_BRANCH),
  ]);
  const _isSuperAdmin = isSuperAdmin([loginUser?.role || ""]);

  if (_canViewSelf && !_isSuperAdmin && !_canViewOthers && !_canViewBranch) {
    query.createdBy = new Types.ObjectId(loginUser?.employeeId);
    query.status = { $eq: "Pending" };
  }

  if (_canViewBranch && !_isSuperAdmin && !_canViewOthers) {
    delete query.status;
    delete query.createdBy;
    query = {
      ...query,
      $or: [{ createdBy: new Types.ObjectId(loginUser?._id) }, { fileBranch: { $in: loginUser?.branches } }],
    };
  }
  if (filters?.loanApplicationNumber) {
    query.loanApplicationNumber = +filters?.loanApplicationNumber;
  }
  if (filters?.startDate || filters?.endDate) {
    const dateFilter: { createdAt?: any } = {};

    if (filters?.startDate) {
      dateFilter.createdAt = { $gte: new Date(filters.startDate) };
    }

    if (filters?.endDate) {
      if (!dateFilter.createdAt) {
        dateFilter.createdAt = {};
      }
      dateFilter.createdAt.$lte = new Date(filters.endDate);
    }

    query.createdAt = dateFilter.createdAt;
    delete query.startDate;
    delete query.endDate;
  }
  let searchQuery;
  if (filters?.search) {
    searchQuery = filters.search;
    delete query.search;
  }
  const aggregationPipeline = [
    {
      $match: {
        ...query,
      },
    },
    {
      $lookup: {
        from: "usersv2",
        localField: "createdBy",
        foreignField: "employeeId",
        as: "createdBy",
        pipeline: [
          {
            $lookup: {
              from: "employeesv2",
              localField: "employeeId",
              foreignField: "_id",
              as: "employeeId",
            },
          },
          {
            $unwind: {
              path: "$employeeId",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              "employeeId.firstName": 1,
              "employeeId.lastName": 1,
              branches: 1,
              role: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$createdBy",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "employeesv2",
        localField: "approvedOrRejectedBy",
        foreignField: "_id",
        as: "approvedOrRejectedBy",
      },
    },
    {
      $unwind: {
        path: "$approvedOrRejectedBy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "approvedOrRejectedBy._id": 0,
        "approvedOrRejectedBy.eId": 0,
        "approvedOrRejectedBy.email": 0,
        "approvedOrRejectedBy.designation": 0,
        "approvedOrRejectedBy.role": 0,
        "approvedOrRejectedBy.sex": 0,
        "approvedOrRejectedBy.dob": 0,
        "approvedOrRejectedBy.maritalStatus": 0,
        "approvedOrRejectedBy.qualification": 0,
        "approvedOrRejectedBy.addressLine1": 0,
        "approvedOrRejectedBy.addressLine2": 0,
        "approvedOrRejectedBy.country": 0,
        "approvedOrRejectedBy.state": 0,
        "approvedOrRejectedBy.mobile": 0,
        "approvedOrRejectedBy.uid": 0,
        "approvedOrRejectedBy.pan": 0,
        "approvedOrRejectedBy.passport": 0,
        "approvedOrRejectedBy.voterID": 0,
        "approvedOrRejectedBy.drivingLicense": 0,
        "approvedOrRejectedBy.isActive": 0,
        "approvedOrRejectedBy.createdAt": 0,
        "approvedOrRejectedBy.createdBy": 0,
        "approvedOrRejectedBy.updatedAt": 0,
        "approvedOrRejectedBy.orgName": 0,
      },
    },
    {
      $lookup: {
        from: "customerv2",
        localField: "customerDetails",
        foreignField: "_id",
        as: "customerDetails",
      },
    },
    {
      $unwind: "$customerDetails",
    },
    {
      $project: {
        "customerDetails._id": 0,
        "customerDetails.dob": 0,
        "customerDetails.gender": 0,
        "customerDetails.altphone": 0,
        "customerDetails.email": 0,
        "customerDetails.uidFront": 0,
        "customerDetails.uidBack": 0,
        "customerDetails.aadhaarNumber": 0,
        "customerDetails.personalPan": 0,
        "customerDetails.voterId": 0,
        "customerDetails.otherId": 0,
        "customerDetails.nationality": 0,
        "customerDetails.religion": 0,
        "customerDetails.education": 0,
        "customerDetails.maritalStatus": 0,
        "customerDetails.hasExtraDetails": 0,
        "customerDetails.isActive": 0,
        "customerDetails.createdAt": 0,
        "customerDetails.createdBy": 0,
        "customerDetails.updatedAt": 0,
        "customerDetails.updatedBy": 0,
        "customerDetails.orgName": 0,
      },
    },
    {
      $match: {
        $or: [
          {
            "customerDetails.firstName": {
              $regex: new RegExp(searchQuery, "i"),
            },
          },
          {
            "customerDetails.middleName": {
              $regex: new RegExp(searchQuery, "i"),
            },
          },
          {
            "customerDetails.lastName": {
              $regex: new RegExp(searchQuery, "i"),
            },
          },
          {
            "customerDetails.aadhaarNumber": {
              $regex: new RegExp(searchQuery, "i"),
            },
          },
          {
            "customerDetails.phone": { $regex: new RegExp(searchQuery, "i") },
          },
          { loanApplicationNumber: { $eq: Number(searchQuery) } },
        ],
      },
    },
    {
      $project: {
        address: 0,
        bank: 0,
        collateralDetails: 0,
        creditCard: 0,
        customerEmploymentDetails: 0,
        customerOtherFamilyDetails: 0,
        customerOtherInformation: 0,
        emiComfort: 0,
        endUseOfMoney: 0,
        existingLoans: 0,
        familyExpenses: 0,
        hasCreditCard: 0,
        photos: 0,
      },
    },
  ];
  const files = await CustomerFileSchema.aggregate(aggregationPipeline).sort({
    createdAt: -1,
  });
  return files;
};

export default getFiles;
