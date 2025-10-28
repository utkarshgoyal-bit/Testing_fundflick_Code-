import { TASK_STATUS } from '@/lib/enums';

const getStatusColor = (status: string) => {
  switch (status) {
    case TASK_STATUS.COMPLETED:
      return ' text-color-success border-color-success';
    case TASK_STATUS.PENDING:
      return ' text-color-warning border-color-warning';
    case TASK_STATUS.IN_PROGRESS:
      return ' text-color-accent border-color-accent';
    case TASK_STATUS.UPCOMING:
      return 'text-color-upcoming  border-color-upcoming';
    case TASK_STATUS.RECURRING:
      return 'text-color-recurring  border-color-recurring';
    default:
      return 'bg-color-surface-muted text-fg-secondary border-fg-border';
  }
};

export default getStatusColor;
