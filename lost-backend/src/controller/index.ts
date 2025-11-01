import AuthController from './auth';
import CreditController from './credit';
import FileControllers from './customerFile';
import FileOperationsController from './customerFile/fileOperations';
import customerAddress from './customerFile/formSteps/customerAddress';
import customerAssociatesController from './customerFile/formSteps/customerAssociates';
import CustomerBankController from './customerFile/formSteps/customerBank';
import CustomerCollateralController from './customerFile/formSteps/customerCollateral';
import CustomerDetailsFileController from './customerFile/formSteps/customerDetails';
import CustomerIncomeController from './customerFile/formSteps/customerIncome';
import CustomerLiabilityController from './customerFile/formSteps/customerLiability';
import CustomerPhotoController from './customerFile/formSteps/customerPhotos';
import DashboardController from './dashboard';
import EmployeesControllers from './employee';
import getIFSCDetails from './ifscDetails';
import ocrController from './ocr';
import PendencyController from './pendency';
import TaskController from './tasks';
import ClientController from './tasks/client';
import ClientLedgerController from './tasks/clientLedger';
import DepartmentController from './tasks/department';
import ServiceController from './tasks/service';
import TeleVerificationController from './teleVerification';
import UsersController from './users';
export {
  AuthController,
  ClientController,
  ClientLedgerController,
  CreditController,
  customerAddress,
  customerAssociatesController,
  CustomerBankController,
  CustomerCollateralController,
  CustomerDetailsFileController,
  CustomerIncomeController,
  CustomerLiabilityController,
  CustomerPhotoController,
  DashboardController,
  DepartmentController,
  EmployeesControllers,
  FileControllers,
  FileOperationsController,
  getIFSCDetails,
  ocrController,
  PendencyController,
  ServiceController,
  TaskController,
  TeleVerificationController,
  UsersController,
};
