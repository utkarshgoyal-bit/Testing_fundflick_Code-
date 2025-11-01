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
import ClientService from './tasks/client';
import ClientLedgerService from './tasks/client/clientLedger';
import DepartmentService from './tasks/department';
import ServiceService from './tasks/service';
import TelephoneQuestionService from './teleVerification';
import UsersServices from './users';

export {
  AuthServices,
  ClientLedgerService,
  ClientService,
  CustomerAddressService,
  CustomerAssociatesServices,
  CustomerBankService,
  CustomerCollateralService,
  CustomerDetailsService,
  CustomerIncomeService,
  CustomerLiabilityService,
  CustomerPhotosService,
  DashboardService,
  DepartmentService,
  EmployeesServices,
  FileControllers,
  FileOperationServices,
  PendencyServices,
  ServiceService,
  TasksService,
  TelephoneQuestionService,
  UsersServices,
};
