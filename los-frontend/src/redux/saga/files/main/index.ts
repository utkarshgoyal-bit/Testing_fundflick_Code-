import FileIFSC from './fileIFSC.saga';
import getCustomerFile from './getCustomerFile.saga';
import getCustomerFileById from './getCustomerFileById.saga';
import getCustomerFileSilent from './getCustomerFileSilent.saga';
import HandleFileComments from './handleFileComments.saga';
import HandleFilePayment from './handleFilePayment.saga';
import HandleFileStatus from './handleFileStatus.saga';
import OCRData from './OCRData.saga';
import resetAllStepsStates from './resetAllStepsStates.saga';
import verifyFormStep from './verifyFormStep.saga';
import verifyTelephoneQuestionStep from './verifyTelephoneQuestionStep.saga';
import Dashboard from './dashboard.saga';

export {
  FileIFSC,
  getCustomerFile,
  getCustomerFileById,
  getCustomerFileSilent,
  HandleFileComments,
  HandleFilePayment,
  HandleFileStatus,
  OCRData,
  resetAllStepsStates,
  verifyFormStep,
  verifyTelephoneQuestionStep,
  Dashboard,
};
