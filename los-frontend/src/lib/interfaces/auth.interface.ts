/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigateFunction } from 'react-router-dom';
import { IUserTable } from '@/lib/interfaces/tables';
import { REGISTER_ROLE_DATA } from '@/redux/actions/types';
export interface IUserInitialState {
  data: {
    user: {
      employeeId: string;
      email: string;
      lastLogin: string;
      loggedFrom: string;
      isActive: boolean;
      role: string;
      _id: string;
    };
    role: string;
    branches: string[];
    employment: {
      _id: string;
      firstName: string;
      lastName: string;
      designation: string;
      mobile: string;
      addressLine1: string;
      addressLine2: string;
      email: string;
      dob: string;
      sex: string;
      maritalStatus: string;
      qualification: string;
      country: string;
      joiningDate: string;
      ledger: string;
      accountNumber: string;
      ifsc: string;
      accountName: string;
      bankName: string;
      state: string;
      baseSalary: string;
      hra: string;
      conveyance: string;
      incentive: string;
      commission: string;
      pan: string;
      passport: string;
      voterID: string;
      drivingLicense: string;
      uid: string;
      eId: string;
      employee: string;
      role: string;

      branch: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  } | null;
  token: string;
  role?: string;
  permissions?: string[];
  loading: boolean;
  error: string;
  modules: string[];
  isAuthenticated: boolean;
  organizations?: [
    {
      _id: string;
      id: string;
      name: string;
      isActive: boolean;
      status: string;
    },
  ];
}

export interface IUserState {
  loading: boolean;
  dialogLoading: boolean;
  error: string | null;
  selectedUser: IUserTable | null;
  tableConfiguration: {
    data: any[];
    total: number;
    tableView: any;
    page: number;
    sort: any[];
  };
}

export interface ILoadingState {
  loading: boolean;
  authenticating: boolean;
  authenticated: boolean;
  message: string;
}

export interface RegisterRolesAction {
  type: typeof REGISTER_ROLE_DATA;
  payload: any;
  navigation?: NavigateFunction;
}
export interface IRoles {
  isSuperAdmin?: boolean;
  isCollectionHead?: boolean;
}
