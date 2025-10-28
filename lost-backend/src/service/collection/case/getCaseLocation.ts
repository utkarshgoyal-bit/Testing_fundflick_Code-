import { Types } from "mongoose";
import CollectionModel from "../../../models/collection/dataModel";
const getCaseLocation = async ({
  caseNo,
  latitude,
  loginUser,
  longitude,
  name,
}: {
  latitude: string;
  longitude: string;
  loginUser: any;
  caseNo: string;
  name?: string;
}) => {
  if (name) {
    const data = await CollectionModel.findOneAndUpdate(
      {
        caseNo,
        "coApplicantsData.name": name,
        organization: loginUser.organization._id,
      },
      {
        $set: {
          "coApplicantsData.$[elem].latitude": latitude,
          "coApplicantsData.$[elem].longitude": longitude,
          updatedBy: new Types.ObjectId(loginUser.employeeId),
        },
      },
      {
        new: true,
        arrayFilters: [{ "elem.name": name }],
      }
    );

    if (!data) {
      throw new Error("Co-applicant with the specified name not found in the case.");
    }

    return true;
  } else {
    const data = await CollectionModel.findOneAndUpdate(
      { caseNo, organization: loginUser.organization._id },
      {
        latitude,
        longitude,
        updatedBy: new Types.ObjectId(loginUser.employeeId),
      },
      {
        new: true,
        upsert: false,
      }
    );

    if (!data) {
      throw new Error("Case not found");
    }

    return true;
  }
};
export default getCaseLocation;
