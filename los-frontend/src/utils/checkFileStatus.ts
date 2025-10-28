import { FILE_STATUS } from '@/lib/enums';

const isFileStatusPending = (status: string) => {
  return [FILE_STATUS.PENDING, FILE_STATUS.TASK_PENDING].includes(status as FILE_STATUS);
};
const isFileStatusApproved = (status: string) => {
  return [FILE_STATUS.APPROVED].includes(status as FILE_STATUS);
};
const isFileInAdminZone = (status: string) => {
  return [FILE_STATUS.APPROVED, FILE_STATUS.REJECTED].includes(status as FILE_STATUS);
};
export { isFileStatusApproved, isFileStatusPending, isFileInAdminZone };
