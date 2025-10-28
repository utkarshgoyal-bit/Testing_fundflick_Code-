import { Types } from "mongoose";
import { User } from "../../interfaces/user.interface";
import { PendencySchema } from "../../models";
import checkPermission from "../../lib/permissions/checkPermission";
import { PERMISSIONS } from "../../shared/enums/permissions";
import isSuperAdmin from "../../helper/booleanCheck/isSuperAdmin";

async function getPendency({ loginUser, active, fileId }: { loginUser: any; active: boolean; fileId: string }) {
  const { role, employeeId, organization } = loginUser;

  const query: any = {
    isDeleted: false,
    fileId,
    organization: organization._id,
  };
  const _isSuperAdmin = isSuperAdmin([loginUser?.role || ""]);

  if ((await checkPermission(loginUser, PERMISSIONS.PENDENCY_VIEW_SELF)) && !_isSuperAdmin) {
    query.$or = [{ createdBy: new Types.ObjectId(employeeId) }, { employeeId: new Types.ObjectId(employeeId) }];
  }

  if (active) {
    query.status = { $ne: "Completed" };
  }

  return await PendencySchema.find(query)
    .sort({ createdAt: -1 })
    .populate("createdBy", ["firstName", "middleName", "lastName"])
    .populate("employeeId", ["_id", "firstName", "lastName"])
    .select([
      "_id",
      "comments",
      "createdAt",
      "createdBy",
      "description",
      "fileId",
      "isDeleted",
      "orgName",
      "status",
      "title",
      "updatedAt",
      "repeat",
      "dueDate",
      "startDate",
      "pendencyId",
      "employeeId",
    ]);
}

export default getPendency;
