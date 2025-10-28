import { NavigateFunction } from 'react-router-dom';
export * from './tables';
export * from './apisResponse.interface';
export * from './shared';
export * from './xForm';
export * from './loanDetails';
export * from './detailsSection.interface';
export * from './routes.interface';
export * from './auth.interface';
export * from './teleVerification.interface';
export * from './task.interface';
export * from './loans.interface';
export * from './address.interface';
export * from './customerFile.interface';
export interface IFollowUpState {
  refCaseId?: string | null;
  loading: boolean;
  error: string | null;
}
export interface IFollowUpPayment {
  _id: string;
  refCaseId?: {
    caseNo?: string;
  };
  visitType: string;
  date: string;
  commit: string;
  remarks?: string;
  attitude?: string;
  createdBy?: {
    _id: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface IPaymentState {
  payments: IFollowUpPayment[] | null;
  error: string | null;
  loading: boolean;
  tableConfiguration: {
    data: [];
    total: number;
    page: number;
    filters: { [key: string]: any };
  };
}

export interface IDashboardInitialState {
  data: any;
  loading: boolean;
  error: string;
  filters: {
    collectionDay: 'today' | 'tomorrow' | 'yesterday';
    followupDay: 'today' | 'tomorrow' | 'yesterday';
    branch?: string[];
  };
}
export interface IDashboardReportsInitialState {
  data: any;
  loading: boolean;
  error: string;
}

export interface IRegisterUsersAction {
  type: string;
  payload: {
    employeeId: string;
    role: string;
    branches: string[];
    id?: string;
  };
  navigation: NavigateFunction;
}
export interface ICaseState {
  data: any;
  loading: boolean;
  error: string | null;
}
export interface IPayment {
  _id: string;
  refCaseId?: {
    caseNo?: string;
  };
  amount: number;
  date: string;
  paymentMode: string;
  remarks?: string;
  extraCharges?: number;
  createdBy?: {
    _id: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface IPaymentData {
  caseId: string;
  customerName: string;
  createdAt: string;
  amount: number;
  paymentMode: string;
  area: string;
  createdAtTimeStamp: number;
  collectionBy: {
    firstName: string;
    lastName: string;
  };
  refCaseId?: {
    caseNo: string;
    customer: string;
    area: string;
  };
  createdBy?: {
    firstName: string;
    lastName: string;
  };
}
export interface ICasePaymentData {
  amount: number;
  extraCharges: number;
  isExtraCharges: boolean;
  date: string;
  paymentMode: 'cash' | 'upi' | 'netbanking' | 'qrcode';
  selfie?: any;
  remarks?: string;
}
export interface ICollectionState {
  refCaseId?: string | null;
  dueEmiAmount?: number;
  loading: boolean;
  error?: string | null;
  tableConfiguration: {
    data: [];
    total: number;
    totalAmount: number;
    page: number;
    filters: { [key: string]: any };
  };
}

export interface ICreateOrganizationsAction {
  type: string;
  payload: {
    _id?: string;
    name: string;
    email: string;
    password: string;
    status: string;
    modules: string[];
  };
  navigation: NavigateFunction;
}

export interface IDepartmentTable {
  _id: string;
  departmentName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentAction {
  type: string;
  payload: {
    _id?: string;
    name: string;
    description?: string;
  };
}
