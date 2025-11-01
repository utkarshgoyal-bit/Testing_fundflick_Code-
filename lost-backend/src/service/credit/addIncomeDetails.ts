import mongoose from 'mongoose';
import { CustomerFile } from '../../schema';
import { ERROR } from '../../shared/enums';

export default async function addIncomeDetails(fileId: string, data: any, loginUser: any) {
  const file = await CustomerFile.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(fileId),
      organization: loginUser.organization._id,
    },
    {
      $push: {
        'credit.incomeDetails': data,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!file || !file.credit || !file.credit.incomeDetails) {
    throw ERROR.NOT_FOUND;
  }

  return file.credit.incomeDetails;
}
