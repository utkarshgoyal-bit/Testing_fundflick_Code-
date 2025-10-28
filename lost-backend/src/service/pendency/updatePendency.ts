import { Types } from "mongoose";
import { PendencySchema } from "../../models";
import { ERROR } from "../../shared/enums";

async function updatePendency({ body, loginUser }: { body: any; loginUser: any }) {
  const { _id, ...payload } = body;
  const updatedPendency = await PendencySchema.findOneAndUpdate(
    { _id: new Types.ObjectId(_id), organization: loginUser.organization._id },
    { ...payload, updatedBy: new Types.ObjectId(loginUser.employeeId) },
    {
      new: true,
      upsert: false,
    }
  );
  if (!updatedPendency) {
    throw ERROR.NOT_FOUND;
  }
  return updatedPendency;
}

export default updatePendency;
