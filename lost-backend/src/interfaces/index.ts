export * from './employee.interface';
export * from './user.interface';
export interface ErrorModel {
  message: string;
  status: number;
  errorStatus: boolean;
  error: string;
}
export interface OCRResponse {
  aadhaarNumber: string;
  dob: string;
}

export type searchQuery = {
  attitude?: ['polite', 'rude', 'medium', 'noReply'];
  caseId?: string;
  endDate?: string | Date;
  page?: string;
  startDate?: string | Date;
  type?: 'date' | 'commit';
  visitType?: 'telCal' | 'visit';
  export?: string | boolean | undefined;
  createdBy?: string;
  branch?: string | string[];
};
export type coApplicantsData = {
  'Case No': string;
  Name: string;
  'Ownership Indicator': string;
  Latitude: string;
  Longitude: string;
}[];

export type searchQueryPayment = {
  caseNo?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  paymentMode?: 'cash' | 'upi' | 'netbanking' | 'qrcode';
  page: string;
  export?: string;
  branch?: string | string[];
};

export interface IDbErrors {
  message: string;
  errors: unknown;
}

export interface LoginUser {
  role: string;
  employeeId: string;
  branches: string[];
  organization: {
    _id: string;
    name: string;
  };
  _id: string;
  email: string;
  name: string;
}
