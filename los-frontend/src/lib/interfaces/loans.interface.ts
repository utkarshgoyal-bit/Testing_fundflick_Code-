export interface GenericApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  error?: any;
}
export interface ApiResponse<T> {
  data: GenericApiResponse<T>;
  error?: any;
}
export interface LoanData {
  loanId: number;
  loanNumber: string;
  principalAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  loanType: string;
  loanStatus: string;
  createdAt: string;
  borrower?: {
    id: number;
    name: string;
    email: string;
  };
  emis?: any[];
  payments?: any[];
}
export interface LoanStatistics {
  totalLoans: number;
  activeLoans: number;
  completedLoans: number;
  totalDisbursed: number;
  totalOutstanding: number;
  totalCollected: number;
  defaultedLoans: number;
}

export interface CreateLoanPayload {
  fileId: number;
  loanType: string;
  processingFee?: number;
}

export interface LoanManagementState {
  // Loading states
  createLoanLoading: boolean;
  fetchLoansLoading: boolean;
  fetchLoanByIdLoading: boolean;
  approveLoanLoading: boolean;
  fetchStatisticsLoading: boolean;

  // Error states
  createLoanError: string | null;
  fetchLoansError: string | null;
  fetchLoanByIdError: string | null;
  approveLoanError: string | null;
  fetchStatisticsError: string | null;

  // Data states
  loans: LoanData[];
  currentLoan: LoanData | null;
  statistics: LoanStatistics | null;
  createdLoan: LoanData | null;

  // UI states
  showCreateDialog: boolean;

  // Pagination and filters
  tableConfiguration: {
    total: number;
    page: number;
    limit: number;
    filters: {
      borrowerId?: number;
      loanStatus?: string;
      loanType?: string;
    };
  };
}
export interface IAllLoansFiles {
  data: LoanData[];
  total: number;
  loading: boolean;
  error: string | null;
}
export interface LoanStats {
  totalLoans: number;
  activeLoans: number;
  completedLoans: number;
  overdueLoans: number;
  totalDisbursed: number;
  totalOutstanding: number;
  totalCollected: number;
  avgTicketSize: number;
  portfolioHealth: number;
  monthlyTarget: number;
  monthlyAchieved: number;
}

export interface EMISchedule {
  emiId: number;
  emiNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidAmount: number;
  paidDate?: string;
  lateDays: number;
}

export interface PaymentRecord {
  paymentId: number;
  paymentNumber: string;
  loanId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  remarks?: string;
}
export interface IAllLoansProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  loanTypeFilter: string;
  setLoanTypeFilter: (value: string) => void;
  filteredLoans: any[];
  setSelectedLoan: (loan: any) => void;
  setShowPaymentModal: (show: boolean) => void;
  viewFileDetailsHandler: (loanId: string) => void;
}
export interface EMISchedule {
  emiId: number;
  emiNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidAmount: number;
  paidDate?: string;
  lateDays: number;
}
export interface Loan {
  id: number;
  loanNumber: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  loanType: string;
  principalAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  outstandingAmount: number;
  totalPaidAmount: number;
  status: string;
  nextEMIDueDate: string;
  disbursementDate: string;
  maturityDate: string;
  completionPercentage: number;
  onTimePaymentPercentage: number;
  createdAt: string;
  updatedAt: string;
}
export interface EMI {
  emiId: number;
  emiNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  penaltyAmount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL_PAID';
  paidDate?: string;
  lateDays: number;
  outstandingPrincipal: number;
  cumulativePrincipalPaid: number;
  cumulativeInterestPaid: number;
  payments: Array<{
    paymentId: number;
    paymentNumber: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: string;
  }>;
}

export interface EMIScheduleTableProps {
  loanId: string;
  loanNumber: string;
  borrowerName: string;
  onRecordPayment?: (emiId: number) => void;
  emiSchedule: EMI[];
  emis: any[];
  penaltyAmount: number;
  totalPaidAmount: string;
  outStandingAmount: number;
  loading: boolean;
}
export interface LoanStatisticsApiResponse extends ApiResponse<LoanStatistics> {}
export interface FetchLoansApiResponse extends ApiResponse<LoanData[]> {}
export interface FetchLoanByIdApiResponse extends ApiResponse<LoanData> {}
export interface CreateLoanApiResponse extends ApiResponse<LoanData> {}
export interface ApproveLoanApiResponse extends ApiResponse<{ loan: LoanData; emiSchedule: any[] }> {}
