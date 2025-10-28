import mongoose from "mongoose";
import { CustomerFile } from "../../models";
import { ERROR } from "../../shared/enums";

export default async function deleteLiabilityDetails(fileId: string, id: string, loginUser: any) {
  const file = await CustomerFile.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(fileId), organization: loginUser.organization._id },
    {
      $pull: {
        "credit.liabilityDetails": { _id: new mongoose.Types.ObjectId(id) },
      },
    },
    {
      new: true,
    }
  );
  if (!file || !file.credit || !file.credit.liabilityDetails) {
    throw ERROR.NOT_FOUND;
  }

  return file.credit.liabilityDetails;
}
