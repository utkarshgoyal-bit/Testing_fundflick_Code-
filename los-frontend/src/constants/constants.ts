import { STEPS_NAMES } from '@/lib/enums';
const steps = [
  { name: STEPS_NAMES.CUSTOMER, label: STEPS_NAMES.CUSTOMER },
  { name: STEPS_NAMES.ADDRESS, label: STEPS_NAMES.ADDRESS },
  { name: STEPS_NAMES.ASSOCIATE, label: STEPS_NAMES.ASSOCIATE },
  { name: STEPS_NAMES.INCOME, label: STEPS_NAMES.INCOME },
  { name: STEPS_NAMES.LIABILITY, label: STEPS_NAMES.LIABILITY },
  { name: STEPS_NAMES.COLLATERAL, label: STEPS_NAMES.COLLATERAL },
  { name: STEPS_NAMES.BANK, label: STEPS_NAMES.BANK },
];
const BEHAVIOUR = [
  {
    name: 'All',
    value: 'none',
  },
  {
    name: 'Polite',
    value: 'polite',
  },
  {
    name: 'Rude',
    value: 'rude',
  },
  {
    name: 'Medium',
    value: 'medium',
  },
  {
    name: 'No reply',
    value: 'Noreply',
  },
];

const VISIT_TYPE_OPTIONS = [
  {
    name: 'All',
    value: 'none',
  },
  {
    name: 'Tel Calling',
    value: 'telecall',
  },
  {
    name: 'Visit',
    value: 'visit',
  },
];
const TASK_STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Completed', value: 'Completed' },
  { label: 'On Hold', value: 'On Hold' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Expired', value: 'Expired' },
  { label: 'Scheduled', value: 'Scheduled' },
];
const FILTER_BY_ASSIGN_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Assigned To Me', value: 'assignedToMe' },
  { label: 'Assigned By Me', value: 'assignedByMe' },
  { label: 'CC', value: 'cc' },
];

export { steps, BEHAVIOUR, VISIT_TYPE_OPTIONS, TASK_STATUS_OPTIONS, FILTER_BY_ASSIGN_OPTIONS };
