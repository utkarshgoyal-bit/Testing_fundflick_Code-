export * from './routes/routes';
export * from './routes/protectedRoutes';
export * from './loan';
export * from './error';
export * from './occupation';
export * from './location';
export * from './cities';
export * from './auth/auth';
export * from './status';
export * from './applicant';
export * from './steps';
export * from './bank';
export * from './customer';
export * from './task';

export const PAYMENT_STATUS = {
  PAID: 'paid',
  DUE_PAYMENT: 'due payment',
  EXPIRED: 'expired',
};

export enum CURRENCY_SYMBOLS {
  INR = '₹',
  DOLLAR = '$',
  EURO = '€',
}

export enum BEHAVIOUR {
  RUDE = 'RUDE',
  POLITE = 'POLITE',
  MEDIUM = 'MEDIUM',
  NOTAVAILABLE = 'NA',
  NOREPLY = 'noreply',
}

export const APP_MODULES = {
  TASK: 'TASK',
  LOS: 'LOS',
  ADMIN: 'ADMIN',
  COLLECTION: 'COLLECTION',
  COMMON: 'COMMON',
  ORGANIZATION: 'ORGANIZATION',
  LMS: 'LMS',
};

export const APP_MODULES_LIST = [
  { label: 'Task Manager', value: 'TASK' },
  { label: 'LOS Manager', value: 'LOS' },
  { label: 'Admin Manager', value: 'ADMIN' },
  { label: 'Collection Manager', value: 'COLLECTION' },
];

export const ORGANIZATION_STATUS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

export enum STATUS {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  UNDER_REVIEW = 'Under Review',
  REJECTED = 'Rejected',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
}
export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  UNDER_REVIEW: 'Under Review',
  REJECTED: 'Rejected',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  SCHEDULED: 'Scheduled',
  OVERDUE: 'Overdue',
  RECURRING: 'Recurring',
  UPCOMING: 'Upcoming',
};

export enum COMMIT_STATUS_ORDER {
  expired = 1,
  pending = 2,
  fulfilled = 3,
}
export const PRIORITY_TYPES = [
  { key: 1, value: 'low' },
  { key: 2, value: 'medium' },
  { key: 3, value: 'high' },
];
export enum PRIORITY {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
