import { Types } from "mongoose";
import { CustomerFile, PendencySchema } from "../../models";
import { ERROR } from "../../shared/enums";
import { TasksUpdateNotification } from "../../socket/sendNotification";

async function createPendency({ body, loginUser }: { body: any; loginUser: any }) {
  const file = await CustomerFile.findOne({
    loanApplicationNumber: body.fileId,
    organization: loginUser.organization._id,
  });
  if (!file) {
    throw ERROR.USER_NOT_FOUND;
  }

  file?.status !== "Approved" &&
    (await CustomerFile.updateOne({ loanApplicationNumber: body.fileId }, { $set: { status: "Task Pending" } }));
  const pendencyData = await PendencySchema.create({
    ...body,
    createdBy: new Types.ObjectId(loginUser.employeeId),
    createdAt: Date.now(),
    updatedBy: new Types.ObjectId(loginUser.employeeId),
    status: "Pending",
    organization: loginUser.organization._id,
  });

  await TasksUpdateNotification({
    message: {
      message: "Pendency",
      title: "Pendency",
    },
    users: [file?.createdBy],
    loanApplicationNumber: body.fileId,
    organization: loginUser.organization._id,
  });
  return pendencyData;
}

export default createPendency;
