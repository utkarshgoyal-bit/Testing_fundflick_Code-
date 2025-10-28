export interface ILoadDetailsDashBoard {
  loanDetails: Record<string, any> | null;
  isSuperAdmin?: boolean;
  isBackOffice?: boolean;
}

export interface ICollaterals {
  landDetails: ILandDetails;
}

export interface ILandDetails {
  totalLandValue: number;
}

export interface IPerson {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  customerType: string;
}
export interface ILoanDetails {
  loanDetails: Record<string, any> | null;
  loading?: boolean;
  error?: any;
  role?: string;
}
