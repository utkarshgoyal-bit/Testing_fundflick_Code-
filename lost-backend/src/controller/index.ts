import UsersController from "./users";
import AuthController from "./auth";
import CreditController from "./credit";
import EmployeesControllers from "./employee";
import getIFSCDetails from "./ifscDetails";
import ocrController from "./ocr";
import CustomerDetailsFileController from "./customerFile/formSteps/customerDetails";
import customerAddress from "./customerFile/formSteps/customerAddress";
import CustomerIncomeController from "./customerFile/formSteps/customerIncome";
import CustomerLiabilityController from "./customerFile/formSteps/customerLiability";
import CustomerCollateralController from "./customerFile/formSteps/customerCollateral";
import CustomerBankController from "./customerFile/formSteps/customerBank";
import CustomerPhotoController from "./customerFile/formSteps/customerPhotos";
import DashboardController from "./dashboard";
import TaskController from "./tasks";
import PendencyController from "./pendency";
import FileOperationsController from "./customerFile/fileOperations";
import TeleVerificationController from "./teleVerification";
import FileControllers from "./customerFile";
import customerAssociatesController from "./customerFile/formSteps/customerAssociates";

export {
  UsersController,
  AuthController,
  EmployeesControllers,
  getIFSCDetails,
  ocrController,
  CustomerDetailsFileController,
  customerAddress,
  CustomerIncomeController,
  CustomerLiabilityController,
  CustomerCollateralController,
  CustomerBankController,
  CustomerPhotoController,
  DashboardController,
  TaskController,
  FileControllers,
  customerAssociatesController,
  PendencyController,
  FileOperationsController,
  TeleVerificationController,
  CreditController,
};
