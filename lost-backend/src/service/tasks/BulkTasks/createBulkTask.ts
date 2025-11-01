import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { REPEAT_STATUS, TASK_STATUS } from '../../../enums/task.enum';
import { LoginUser } from '../../../interfaces';
import { IAddTaskPayload } from '../../../interfaces/task.interface';
import { EmployeeSchema, TaskSchema } from '../../../schema';
import ServicesSchema from '../../../schema/tasks/services';
import { generateTaskId } from '../../../utils/generateTaskId';
import { getOrganizationSettings } from '../../organizationConfigs/getOrganizationConfigs';
import createNoRepeatBulkTask from './createNoRepeatBulkTask';

export default async function createBulkTask({
  body,
  loginUser,
}: {
  body: IAddTaskPayload;
  loginUser: LoginUser;
}) {
  const {
    organization: { _id: organizationId, name: orgName },
    employeeId,
  } = loginUser;
  const settings = await getOrganizationSettings({
    organizationId: organizationId,
  });
  const timezone = settings.find(set => set.id === 'timezone')?.value || 'Asia/Kolkata';
  const taskId = await generateTaskId(organizationId.toString(), orgName, true);
  const status = TASK_STATUS.SCHEDULED;
  const employeeDetails = await EmployeeSchema.findById({
    _id: new Types.ObjectId(employeeId),
    organization: organizationId,
  });
  if (!employeeDetails) {
    throw new Error('Employee not found');
  }
  const employeeName = employeeDetails.firstName + ' ' + employeeDetails.lastName;

  const serviceId: string = (body.serviceId || '').toString();

  const serviceName = await ServicesSchema.findById({
    _id: new Types.ObjectId(serviceId),
    organizationId,
  })
    .select('serviceName')
    .lean();

  if (!serviceName) {
    throw new Error('Service not found');
  }

  const bulkStatusPayload = {
    ...body,
    title: body.title || serviceName.serviceName,
    orgName,
    createdBy: new Types.ObjectId(employeeId),
    updatedBy: new Types.ObjectId(employeeId),
    status,
    taskId,
    isBulkTask: true,
    organizationId,
    timeline: {
      createdBy: employeeId,
      comment: 'Task Created!!',
      createdByName: employeeName,
      createdAt: moment().tz(timezone).unix(),
    },
  };

  const bulkTask = await TaskSchema.create(bulkStatusPayload);
  if (body.repeat === REPEAT_STATUS.NO_REPEAT) {
    await createNoRepeatBulkTask(
      body,
      employeeId,
      employeeName,
      timezone,
      orgName,
      organizationId,
      bulkTask,
      serviceId
    );
  }

  return true;
}
