import moment from 'moment';
import { REPEAT_STATUS } from '../../enums/task.enum';
import TasksSchema from '../../schema/tasks';

export default async function createRepeatedTasks(taskId: number) {
  try {
    const [task] = await TasksSchema.find({ taskId }).sort({ createdAt: -1 }).limit(1);
    if (!task) {
      console.error('Task not found for taskId:', taskId);
      return;
    }

    const { repeat, startDate, dueAfterDays, organizationId } = task;
    const due = moment(startDate).add(dueAfterDays, 'days');
    const today = moment();

    if (!repeat || today.isAfter(due)) {
      console.warn('Repeat not set or due date passed. Skipping task creation.');
      return;
    }

    let nextStartDate: moment.Moment;

    if (repeat === REPEAT_STATUS.WEEKLY) {
      nextStartDate = moment(startDate).add(1, 'week');
    } else if (repeat === REPEAT_STATUS.MONTHLY) {
      nextStartDate = moment(startDate).add(1, 'month');
    } else if (repeat === REPEAT_STATUS.YEARLY) {
      nextStartDate = moment(startDate).add(1, 'year');
    } else {
      console.warn('Repeat type not supported or is "noRepeat".');
      return;
    }

    await TasksSchema.create({
      ...task.toObject(),
      _id: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: nextStartDate.toDate(),
      dueAfterDays,
      taskId: taskId,
      comments: [],
      status: 'Pending',
      organizationId: organizationId,
    });

    console.log(
      `Repeated task created for taskId ${taskId} with startDate ${nextStartDate.format('YYYY-MM-DD')}`
    );
  } catch (error) {
    console.error('Error creating repeated task:', error);
  }
}
