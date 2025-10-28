import TasksSchema from '../models/tasks';
import cron from 'node-cron';
import moment from 'moment';
import { default as Logger } from '../lib/logger';
cron.schedule('0 2 * * *', async () => {
  try {
    const tasks = await TasksSchema.find({ isDeleted: false, status: { $ne: 'Completed' } });
    const today = moment().startOf('day');

    for (const task of tasks) {
      const { _id, repeat, startDate, dueAfterDays } = task;
      if (!startDate) continue;

      const dueDate = moment(startDate).add(dueAfterDays, 'days');

      if (today.isAfter(dueDate)) {
        await TasksSchema.updateOne(
          { _id },
          { $set: { status: 'Expired', updatedAt: new Date() } }
        );

        if (repeat && repeat !== 'noRepeat') {
          const nextStartDate = moment(startDate);
          if (repeat === 'weekly') nextStartDate.add(1, 'week');
          else if (repeat === 'monthly') nextStartDate.add(1, 'month');
          else if (repeat === 'yearly') nextStartDate.add(1, 'year');
          else continue;

          await TasksSchema.create({
            ...task.toObject(),
            _id: undefined,
            status: 'Pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            startDate: nextStartDate.toDate(),
            comments: [],
          });
        }
      }
    }
  } catch (error) {
    Logger.error('Cron job error:', error);
  }
});
