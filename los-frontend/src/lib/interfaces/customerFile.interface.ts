export interface IFamilyMembers {
  _id: string;
  firstName: string;
  lastName: string;
  customerType: string;
}
export interface ICustomerFileTable {
  _id: string;
  status: string;
  loanApplicationNumber: string;
  customerDetails: {
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
  };
  loanType: string;
  loanAmount: number;
  createdBy: {
    employeeId: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
  loanApplicationFilePayment: {
    amount: number;
  };
  fileCommentsReadStatus: boolean;
  loanTenure: number;
  salesManReport: {
    interestRate: number;
    emi: number;
    tenureType: string;
    loanTenure: number;
  };
  finalApproveReport: {
    interestRate: number;
    emi: number;
    tenureType: string;
    loanTenure: number;
  };
}
export interface CustomerFilesState {
  associateDialogAdd: boolean;
  formLoading: boolean;
  associateDialogEdit: boolean;
  liabilityDialogAdd: boolean;
  liabilityDialogEdit: boolean;
  backOfficeAssociateDialog: boolean;
  PhotoGroupDialogAdd: {
    [key: string]: boolean;
  };
  loading: boolean;
  error: string | null;
  filters: {
    [key: string]: any;
  } | null;
  tableConfiguration: {
    data: ICustomerFileTable[];
    total: number;
    tableView: any;
    page: number;
    sort: any[];
  };
  stepsData: any;
  activeStep: string;
  completedSteps: string[];
  existingLoans: any[];
  stepsDone: [];
  selectedFile: any;
}
