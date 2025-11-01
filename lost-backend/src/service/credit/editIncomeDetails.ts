import mongoose from 'mongoose';
import { CustomerFile } from '../../schema';
import { ERROR } from '../../shared/enums';

export default async function editIncomeDetails(
  fileId: string,
  id: string,
  data: any,
  loginUser: any
) {
  const file = await CustomerFile.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(fileId),
      'credit.incomeDetails._id': new mongoose.Types.ObjectId(id),
      organization: loginUser.organization._id,
    },
    {
      $set: {
        'credit.incomeDetails.$': data,
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
