import fileHandlersService from './fileHandlersService';
import fileVerificationService from './fileVerificationService';
import getCustomerRecord from './getCustomerRecord';
import getVehicleDetails from './getVehicleDetails';
import handleReceiveFilePayment from './handleReceiveFilePayment';
import telephoneVerificationService from './telephoneVerificationService';
import updateCustomerCibilScore from './updateCustomerCibilScore';
import updateCustomerFileStatus from './updateCustomerFileStatus';
import updateFileComments from './updateFileComments';

export default {
  fileHandlersService,
  fileVerificationService,
  getCustomerRecord,
  updateCustomerCibilScore,
  updateFileComments,
  handleReceiveFilePayment,
  telephoneVerificationService,
  updateCustomerFileStatus,
  getVehicleDetails,
};
