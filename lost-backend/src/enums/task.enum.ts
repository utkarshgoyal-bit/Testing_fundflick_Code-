export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  UNDER_REVIEW: 'Under Review',
  REJECTED: 'Rejected',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue',
  UPCOMING: 'Upcoming',
  SCHEDULED: 'Scheduled',
};

export const REPEAT_STATUS = {
  NO_REPEAT: 'no_repeat',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  QUARTERLY: 'quarterly',
};

export type TASK_DASHBOARD_TYPE_ENUM = 'team' | 'individual' | 'all';
export const TASK_DASHBOARD_TYPES = {
  TEAM: 'team' as TASK_DASHBOARD_TYPE_ENUM,
  INDIVIDUAL: 'individual' as TASK_DASHBOARD_TYPE_ENUM,
  ALL: 'all' as TASK_DASHBOARD_TYPE_ENUM,
};

export type CLIENT_LEDGER_PAYMENT_STATUS_ENUM = 'Pending' | 'Invoice Sent' | 'Received';
export const CLIENT_LEDGER_PAYMENT_STATUS = {
  PENDING: 'Pending',
  INVOICE_SENT: 'Invoice Sent',
  RECEIVED: 'Received',
};

export const DUE_STATUS = {
  DUE_TODAY: 'Due today',
  DUE_TOMORROW: 'Due tomorrow',
  DUE_IN_N_DAYS: 'Due in %d days',
  OVERDUE_YESTERDAY: 'Overdue yesterday',
  OVERDUE_N_DAYS: 'Overdue by %d days',
  DUE_ON: 'Due on %s',
};
