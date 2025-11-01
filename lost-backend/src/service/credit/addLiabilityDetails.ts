import mongoose from 'mongoose';
import { CustomerFile } from '../../schema';
import { ERROR } from '../../shared/enums';

export default async function addLiabilityDetails(fileId: string, data: any, loginUser: any) {
  const file = await CustomerFile.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(fileId),
      organization: loginUser.organization._id,
    },
    {
      $push: {
        'credit.liabilityDetails': data,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!file || !file.credit || !file.credit.liabilityDetails) {
    throw ERROR.NOT_FOUND;
  }

  return file.credit.liabilityDetails;
}
