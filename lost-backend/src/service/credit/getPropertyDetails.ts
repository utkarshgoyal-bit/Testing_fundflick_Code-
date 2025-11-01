import mongoose from 'mongoose';
import { CustomerFile } from '../../schema';
import { ERROR } from '../../shared/enums';

export default async function getPropertyDetails(fileId: string, loginUser: any) {
  const file = await CustomerFile.findOne({
    _id: new mongoose.Types.ObjectId(fileId),
    organization: loginUser.organization._id,
  }).select({
    credit: 1,
  });
  if (!file || !file.credit || !file.credit.personalDetails) {
    throw ERROR.NOT_FOUND;
  }

  return file.credit.propertyDetails;
}
