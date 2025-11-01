import { Types } from 'mongoose';
import { PendencySchema } from '../../schema';
import { ERROR } from '../../shared/enums';

async function reActivate({ loginUser, body }: { loginUser: any; body: any }) {
  const { _id } = body;
  const completedPendency = await PendencySchema.findOneAndUpdate(
    { _id: new Types.ObjectId(_id), organization: loginUser.organization._id },
    {
      status: 'Pending',
      updatedAt: new Date(),
      updatedBy: new Types.ObjectId(loginUser.employeeId),
    }
  );
  if (!completedPendency) {
    throw ERROR.INVALID_OPERATION;
  }
  return completedPendency;
}

export default reActivate;
