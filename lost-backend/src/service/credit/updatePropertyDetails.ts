import mongoose from 'mongoose';
import { CustomerFile } from '../../schema';
import { ERROR } from '../../shared/enums';

export default async function updatePropertyDetails(fileId: string, data: any, loginUser: any) {
  const file = await CustomerFile.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(fileId),
      organization: loginUser.organization._id,
    },
    {
      $set: {
        'credit.propertyDetails': data,
      },
    },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!file || !file.credit || !file.credit.propertyDetails) {
    throw ERROR.NOT_FOUND;
  }

  return file.credit.propertyDetails;
}
