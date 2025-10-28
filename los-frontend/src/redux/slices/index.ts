import { combineReducers } from 'redux';
import branchesReducer from './branches';
import DashboardReducer from './dashboard';
import CollectionDashboardReducer from './collection/collectionDashboard';
import EmployeeReducer from './employees';
import loginReducer from './login';
import NotificationReducer from './notifications';
import PendencySlice from './pendency';
import publicSlice from './publicSlice';
import TasksReducer from './tasks';
import questionsSlice from './teleVerification';
import userManagementReducer from './users';
import customerFilesReducer from './files';
import fileAddressReducer from './files/address';
import fileAssociatesReducer from './files/associates';
import fileBankReducer from './files/bank';
import fileCollateralReducer from './files/collateral';
import fileCustomerDetailsReducer from './files/customerDetails';
import fileIncomeReducer from './files/income';
import fileLiabilityReducer from './files/liability';
import filePhotoReducer from './files/photos';
import collectionReducer from './collection';
import branchCollectionReducer from './collection/branchUpdate';
import FollowUpsliceDetails from './collection/folllowUpSlice';
import followUpAddDataReducer from './collection/followUpdateDataSlice';
import noticesReducer from './collection/noticeSlice';
import paymentCollectionReducer from './collection/paymentSliceCollection';
import paymentSliceDetails from './collection/paymentUpdateDueEmiSlice';
import collectionUploadReducer from './collection/uplodefileSlice';
import rolesSlice from './roles';
import branchCollectionCaseNoData from './collection/collectionCaseNoSlice';
import creditReducer from './credit';
import organizationReducer from './organizationAdmin';
import collectionDashboardReportReducer from './collection/collectionDashboardReports';
import createNewLoanReducers from './loanManagement/createNewLoan';
import fetchAllLoansReducers from './loanManagement/fetchAllLoans';
import fetchAllLoansStatisticsReducers from './loanManagement/fetchLoanStatistics';
import fetchLoanByIdReducers from './loanManagement/fetchLoanById';
import ClientReducer from './client';
import ServiceReducer from './services';
import DepartmentReducer from './department';
import fetchOrganizationConfigsReducer from './organizationConfigs/fetchOrganizationConfigs';
import tasksDashboardSlice from './taskDashboard';
const rootReducer = combineReducers({
  department: DepartmentReducer,
  client: ClientReducer,
  service: ServiceReducer,
  credit: creditReducer,
  organizations: organizationReducer,
  userManagement: userManagementReducer,
  login: loginReducer,
  customerFiles: customerFilesReducer,
  fileAddress: fileAddressReducer,
  fileAssociates: fileAssociatesReducer,
  fileBank: fileBankReducer,
  fileCollateral: fileCollateralReducer,
  fileCustomerDetails: fileCustomerDetailsReducer,
  fileIncome: fileIncomeReducer,
  fileLiability: fileLiabilityReducer,
  filePhotos: filePhotoReducer,
  branch: branchesReducer,
  employee: EmployeeReducer,
  dashboard: DashboardReducer,
  collectionDashboard: CollectionDashboardReducer,
  notification: NotificationReducer,
  tasks: TasksReducer,
  taskDashboard: tasksDashboardSlice,
  pendency: PendencySlice,
  publicSlice: publicSlice,
  questionsSlice: questionsSlice,
  collection: collectionUploadReducer,
  collectionData: collectionReducer,
  paymentSliceDetails: paymentSliceDetails,
  FollowUpsliceDetails: FollowUpsliceDetails,
  notices: noticesReducer,
  collectionPayment: paymentCollectionReducer,
  followUpAddData: followUpAddDataReducer,
  branchCollection: branchCollectionReducer,
  branchCollectionCaseNoData: branchCollectionCaseNoData,
  roles: rolesSlice,
  collectionDashboardReport: collectionDashboardReportReducer,
  newLoan: createNewLoanReducers,
  allLoans: fetchAllLoansReducers,
  allLoansStatistics: fetchAllLoansStatisticsReducers,
  loanById: fetchLoanByIdReducers,
  organizationConfigs: fetchOrganizationConfigsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
