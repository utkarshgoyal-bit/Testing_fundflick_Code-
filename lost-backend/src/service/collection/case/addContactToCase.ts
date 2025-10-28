import { Types } from "mongoose";
import CollectionModel from "../../../models/collection/dataModel";
const addCaseContact = async ({
  body,
  loginUser,
}: {
  body: {
    contactNo: string[];
    coApplicantName?: string;
    isCoApplicant?: boolean;
    caseNo?: string;
  };
  loginUser: any;
}) => {
  const { contactNo, coApplicantName, isCoApplicant, caseNo } = body;

  if (!caseNo) throw new Error("Case number is required");
  if (isCoApplicant) {
    if (!coApplicantName) throw new Error("Co-Applicant name is required");
    const data = await CollectionModel.findOneAndUpdate(
      {
        caseNo,
        "coApplicantsData.name": coApplicantName,
        organization: loginUser.organization._id,
      },
      {
        $push: {
          "coApplicantsData.$[elem].contactNo": {
            $each: contactNo.map((num) => num.trim()),
          },
        },
        $set: {
          updatedBy: new Types.ObjectId(loginUser.employeeId),
        },
      },
      {
        new: true,
        arrayFilters: [{ "elem.name": coApplicantName }],
      }
    );

    if (!data) throw new Error("Case or co-applicant not found");

    return true;
  } else {
    const data = await CollectionModel.findOneAndUpdate(
      { caseNo, organization: loginUser.organization._id },
      {
        $push: {
          contactNo: {
            $each: contactNo.map((num) => num.trim()),
          },
        },
        $set: {
          updatedBy: new Types.ObjectId(loginUser.employeeId),
        },
      },
      { new: true, upsert: false }
    );

    if (!data) throw new Error("Case not found");

    return true;
  }
};

export default addCaseContact;
