import { Types } from 'mongoose';
import { PendencySchema } from '../../schema';
import { ERROR } from '../../shared/enums';

async function deletePendency({ loginUser, body }: { loginUser: any; body: any }) {
  const { _id } = body;
  const deletedPendency = await PendencySchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(_id),
      createdBy: new Types.ObjectId(loginUser.employeeId),
      organization: loginUser.organization._id,
    },
    {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: new Types.ObjectId(loginUser.employeeId),
    }
  );
  if (!deletedPendency) {
    throw ERROR.INVALID_OPERATION;
  }
  return deletedPendency;
}

export default deletePendency;
