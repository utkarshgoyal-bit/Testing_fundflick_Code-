import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { TASK_STATUS } from '../../../enums/task.enum';
import { ClientSchema, TaskSchema } from '../../../schema';
import { generateTaskId } from '../../../utils/generateTaskId';

const createNoRepeatBulkTask = async (
  body: any,
  employeeId: string,
  employeeName: string,
  timezone: string,
  orgName: string,
  organizationId: string,
  bulkTask: any,
  serviceId: string
): Promise<boolean> => {
  const getAllClients = await ClientSchema.find({
    services: {
      $in: [new Types.ObjectId(serviceId)],
    },
    MONGO_DELETED: false,
  }).lean();
  let status = TASK_STATUS.PENDING;
  const isFuture = moment(body.startDate).isAfter(moment(), 'day');
  if (isFuture) {
    status = TASK_STATUS.UPCOMING;
  }

  const bulkTaskId: string = bulkTask._id.toString();

  if (getAllClients.length > 0) {
    Promise.all(
      getAllClients.map(async client => {
        const taskId = await generateTaskId(organizationId.toString(), orgName, false);
        await TaskSchema.create({
          ...body,
          orgName,
          createdBy: new Types.ObjectId(employeeId),
          updatedBy: new Types.ObjectId(employeeId),
          status,
          taskId,
          organizationId,
          title: client.name,
          refTaskId: new Types.ObjectId(bulkTaskId),
          isBulkTask: false,
          clientId: client._id,
          clientName: client.name,
          timeline: {
            createdBy: employeeId,
            comment: 'Task Created!!',
            createdByName: employeeName,
            createdAt: moment().tz(timezone).unix(),
          },
          createdAt: moment().tz(timezone).unix(),
        });
      })
    );
  }
  return true;
};
export default createNoRepeatBulkTask;
