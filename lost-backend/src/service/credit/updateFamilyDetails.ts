import mongoose from "mongoose";
import { CustomerFile } from "../../models";
import { ERROR } from "../../shared/enums";

export default async function updateFamilyDetails(fileId: string, data: any, loginUser: any) {
  const file = await CustomerFile.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(fileId),
      organization: loginUser.organization._id,
    },
    {
      $set: {
        "credit.familyDetails": data,
      },
    },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!file || !file.credit || !file.credit.familyDetails) {
    throw ERROR.NOT_FOUND;
  }

  return file.credit.familyDetails;
}
