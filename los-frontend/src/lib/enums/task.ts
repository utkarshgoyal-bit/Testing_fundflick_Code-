export const REPEAT_STATUS = {
  NO_REPEAT: 'no_repeat',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  QUARTERLY: 'quarterly',
};

export enum OVERDUE_COLOR_SCHEMA {
  ON_TIME = 'text-color-success border-color-success bg-color-success/10',
  DUE_TODAY = 'text-color-warning border-color-warning bg-color-warning/10',
  ONE_DAY_OVERDUE = 'text-color-error border-color-error bg-color-error/10',
  TWO_DAY_OVERDUE = 'text-color-error2 border-color-error2 bg-color-error2/10',
  SEVERELY_OVERDUE = 'text-red-800 border-red-800 bg-red-800/20',
}
