import { Types } from 'mongoose';

export interface User {
  organization: string;
  organizations: Array<{
    name: string;
    _id: string;
    status: string;
    isActive: boolean;
    id: string;
  }>;
  employeeId: string;
  roleRef: {
    name: string;
    permissions: Array<string>;
  };
  password: string;
  roles: Array<string>;
  branches: Array<Branch>;
  loggedIn: number;
  loggedFrom: string;
  avatar?: string;
  email: string;
  role?: string;
  branch?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  userId: string;
  os: string;
  browser: string;
  _id: Types.ObjectId;
}
export interface DbError {
  errorStatus: string;
  errors: object;
  message: string;
}

export interface Branch {
  name: string;
  id: string;
}
