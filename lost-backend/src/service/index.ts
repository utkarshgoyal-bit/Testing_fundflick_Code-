import AuthServices from './auth';
import FileOperationServices from './customerFile/fileOperations';
import CustomerAddressService from './customerFile/fromSteps/address';
import CustomerAssociatesServices from './customerFile/fromSteps/associates';
import CustomerBankService from './customerFile/fromSteps/bank';
import CustomerCollateralService from './customerFile/fromSteps/collateral';
import CustomerDetailsService from './customerFile/fromSteps/customer';
import CustomerIncomeService from './customerFile/fromSteps/income';
import CustomerLiabilityService from './customerFile/fromSteps/liability';
import CustomerPhotosService from './customerFile/fromSteps/photos';
import FileControllers from './customerFile/main';
import DashboardService from './dashboard';
import EmployeesServices from './employee';
import PendencyServices from './pendency';
import TasksService from './tasks';
import TelephoneQuestionService from './teleVerification';
import UsersServices from './users';

export {
  AuthServices,
  CustomerAddressService,
  CustomerAssociatesServices,
  CustomerBankService,
  CustomerCollateralService,
  CustomerDetailsService,
  CustomerIncomeService,
  CustomerLiabilityService,
  CustomerPhotosService,
  DashboardService,
  EmployeesServices,
  FileControllers,
  FileOperationServices,
  PendencyServices,
  TasksService,
  TelephoneQuestionService,
  UsersServices,
};
