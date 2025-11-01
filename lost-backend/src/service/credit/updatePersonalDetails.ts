import mongoose from 'mongoose';
import { CustomerFile } from '../../schema';
import { ERROR } from '../../shared/enums';

export default async function updatePersonalDetails(fileId: string, data: any, loginUser: any) {
  const file = await CustomerFile.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(fileId),
      organization: loginUser.organization._id,
    },
    {
      $set: {
        'credit.personalDetails': data,
      },
    },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!file || !file.credit || !file.credit.personalDetails) {
    throw ERROR.NOT_FOUND;
  }

  return file.credit.personalDetails;
}
