import { TASK_STATUS } from '@/lib/enums';

const getStatusDot = (status: string): string => {
  switch (status) {
    case TASK_STATUS.REJECTED:
      return 'bg-color-error';
    case TASK_STATUS.PENDING:
      return 'bg-color-warning';
    case TASK_STATUS.COMPLETED:
      return 'bg-color-success';
    case TASK_STATUS.UPCOMING:
      return 'text-color-upcoming  border-color-upcoming';
    case TASK_STATUS.RECURRING:
      return 'bg-color-recurring';
    default:
      return 'bg-fg-border';
  }
};

export default getStatusDot;
