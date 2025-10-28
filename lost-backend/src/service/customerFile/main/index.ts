import getFiles from './getFiles';
import getFileById from './getFilesById';
export const filesCommonSelectedData = {
  _id: 1,
  loanApplicationNumber: 1,
  stepsDone: 1,
  status: 1,
  verifiedSteps: 1,
  teleVerificationReport: 1,
};
export default {
  getFiles,
  getFileById,
  filesCommonSelectedData,
};
