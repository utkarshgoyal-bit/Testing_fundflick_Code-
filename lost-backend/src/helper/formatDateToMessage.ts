import moment from 'moment-timezone';
import { DUE_STATUS } from '../enums/task.enum';
/**
 * Converts an epoch timestamp to a human-readable due date message
 * @param epochTimestamp - The due date in epoch milliseconds
 * @param timezone - The timezone to use for date calculations (e.g., 'Asia/Kolkata', 'America/New_York')
 * @returns A formatted message like "due today", "due in 2 days", "overdue by 3 days", etc.
 */
const formatDateToMessage = ({
  epochTimestamp,
  timezone = 'Asia/Kolkata',
}: {
  epochTimestamp: number;
  timezone?: string;
}): string => {
  const today = moment().tz(timezone).startOf('day');

  const dueDate = moment(epochTimestamp).tz(timezone).startOf('day');

  const diffInDays = dueDate.diff(today, 'days');

  if (diffInDays < 0) {
    const overdueDays = Math.abs(diffInDays);
    if (overdueDays === 1) {
      return DUE_STATUS.OVERDUE_YESTERDAY;
    }
    return `Overdue by ${overdueDays} days`;
  } else if (diffInDays === 0) {
    return DUE_STATUS.DUE_TODAY;
  } else if (diffInDays === 1) {
    return DUE_STATUS.DUE_TOMORROW;
  } else {
    return DUE_STATUS.DUE_ON.replace('%s', dueDate.format('YYYY-MM-DD'));
  }
};

export default formatDateToMessage;
