import mongoose from "mongoose";
import { CustomerFile } from "../../models";
import { ERROR } from "../../shared/enums";

export default async function deleteIncomeDetails(fileId: string, id: string, loginUser: any) {
  const file = await CustomerFile.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(fileId), organization: loginUser.organization._id },
    {
      $pull: {
        "credit.incomeDetails": { _id: new mongoose.Types.ObjectId(id) },
      },
    },
    {
      new: true,
    }
  );
  if (!file || !file.credit || !file.credit.incomeDetails) {
    throw ERROR.NOT_FOUND;
  }

  return file.credit.incomeDetails;
}
