export interface ILoginApiResponse {
  user: {
    employeeId: string;
    email: string;
    roles: string[];
    role: string;
    branches: string[];
    lastLogin: string;
    loggedFrom: string;
    isActive: boolean;
    _id: string;
  }[];
  token: string;
  organizations: any[];
}

export interface IFSCCodeResponse {
  STATE: string;
  CITY: string;
  SWIFT: null | string;
  ISO3166: string;
  IMPS: boolean;
  MICR: string;
  BRANCH: string;
  NEFT: boolean;
  ADDRESS: string;
  DISTRICT: string;
  CONTACT: string;
  CENTRE: string;
  UPI: boolean;
  RTGS: boolean;
  BANK: string;
  BANKCODE: string;
  IFSC: string;
}
