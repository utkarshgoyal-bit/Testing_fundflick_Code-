import { COLLECTION_ROUTES, STATUS } from '@/lib/enums';
export type IUserTable = {
  _id: string;
  employeeId: string;
  email: string;
  role: string;
  ledgerBalance: number;
  branches: string[];
  isActive: boolean;
  createdAt: Date;
  name?: string;
  roles?: string[];
  roleRef: {
    _id: string;
    name: string;
    permissions: string[];
  };
  ledgerBalanceHistory: [
    {
      ledgerBalance: number;
      date: string;
      remarks: string;
      type: string;
      _id: string;
    },
  ];
};

export type IRolesTable = {
  _id: string;
  name: string;
  permissions: string[];
  rolesAccess: string[];
};

export type ITelephoneTable = {
  _id: string;
  question: string;
  description: string;
};
export type IOrganizationAdmin = {
  _id: string;
  name: string;
  isActive: boolean;
  status: string;
  modules: string[];
  email: string;
};
export type IEmployeeTable = {
  _id: string;
  firstName: string;
  lastName: string;
  eId: string;
  email: string;
  designation: string;
  role: string;
  sex: string;
  dob: string;
  maritalStatus: string;
  qualification: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  mobile: string;
  uid: string;
  pan: string;
  passport: string;
  voterID: string;
  drivingLicense: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  joiningDate: string;
  __v: number;
};

export interface IBranchTable {
  _id: string;
  name: string;
  landMark: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  createdAt: number;
  updatedAt: number;
  isRoot: boolean;
  isActive: boolean;
  children: IBranchTable[];
}

export interface ITaskTable {
  _id: string;
  startDate: string;
  taskId: number;
  amount: number;
  title: string;
  description: string;
  fileId: number;
  status: STATUS;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  caseNo: string;
  paymentType: string;
  dueAfterDays: number;
  type: string;
  acceptedBy: string;
  timeline: {
    comment: string;
    createdAt: number;
    createdBy: string;
    createdByName: string;
  }[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    middleName: string;
  };
  dueDate: Date;
  repeat: string;
  users: { name: string; userDetails: string }[];
  clientId: {
    name: string;
    email: string;
  };
  serviceId: {
    serviceName: string;
  };
  weeklyDay: string[];
  monthlyDay: number;
  yearlyDay: number;
  yearlyMonth: number;
  priorityOfTask: number;
  cc: string[];
  isPinned: boolean;
  comments: [
    {
      comment: string;
      createdAt: string;
      createdBy: {
        _id: string;
        firstName: string;
        lastName: string;
        middleName: string;
      };
    },
  ];
}
export interface IPendencyTable {
  _id: string;
  startDate: string;
  taskId: number;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    middleName: string;
  };
  title: string;
  description: string;
  fileId: number;
  status: 'Pending' | 'Completed';
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    middleName: string;
  };
  dueDate: Date;
  repeat: string;
  comments: [
    {
      comment: string;
      createdAt: string;
      createdBy: {
        _id: string;
        firstName: string;
        lastName: string;
        middleName: string;
      };
    },
  ];
}

export interface ICollectionTable {
  loanType: string;
  caseNo: string;
  customer: string;
  contactNo: string;
  emiAmount: number;
  dueEmiAmount: number;
  dueEmi: number;
  lastPaymentDetail: string;
  address: string;
  area: string;
  financeAmount: string;
  tenure: string;
  caseDate: string;
  collectionStatus: string;
  branches: string[];
}

export interface ICollectionTableData {
  data: ICollectionTable[];
  branches: string[];
  total?: number;
}

export interface IPersonalDetails {
  whoMet?: string;
  married?: string;
  siblings?: string;
  education?: string;
  totalMembers?: string;
  earningMembers?: string;
  monthlyEarning?: string;
  neighborName?: string;
  neighborFeedback?: string;
  livingStandard?: string;
  loanRequired?: string;
  loanUse?: string;
}

export interface ICollectionPayment {
  refCaseId?: {
    caseNo?: string;
  };
  amount: number;
  date: string;
  paymentMode: string;
  remarks?: string;
}
export interface IBranchState {
  loading: boolean;
  error: string | null;
  selectedBranch: IBranchTable | null;
  tableConfiguration: {
    data: IBranchTable[] | [];
    total: number;
    tableView: any;
    page: number;
    sort: any[];
  };
  loanTypes: any[];
}
export interface ICardReviewProps {
  apiData: ICollectionTable[];
  onPhoneClick: (contactNo: string) => void;
  handleNavigation: (caseNo: string, type: `${COLLECTION_ROUTES.COLLECTION}` | `${COLLECTION_ROUTES.FOLLOWUP}`) => void;
}

export interface IClientTable {
  _id: string;
  name: string;
  clientType: 'individual' | 'business';

  // Common fields
  email?: string;
  mobile?: string;
  address?: string;
  aadhaar?: string;
  pan?: string;
  gst?: string;
  tan?: string;
  cin?: string;

  // Contact Person
  contactPerson?: {
    name?: string;
    mobile?: string;
    email?: string;
  };

  // Business-specific
  organizationName?: string;
  organizationType?: 'llp' | 'pvtLtd' | 'proprietorship' | 'partnership' | 'limited' | 'other';
  directors?: {
    _id: string;
    name: string;
    din: string;
    aadhaar?: string;
  }[];

  // Bank Details
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  branch?: string;

  // Portal Access
  portalName?: string;
  portalId?: string;
  portalPassword?: string;

  // Services (multiple allowed now, not single serviceId)
  services: {
    _id: string;
    serviceName: string;
    departmentId: string; // You can expand this to object if needed later
    subCategories: {
      _id: string;
      returnName: string;
      frequency: 'monthly' | 'quarterly' | 'yearly' | string;
      description?: string;
    }[];
    orgName?: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    isDeleted: boolean;
  }[];

  // Metadata
  organization?: string;
  orgName?: string;
  isDeleted: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  __v?: number;
}

export interface IServiceTable {
  _id: string;
  serviceName: string;
  departmentId: {
    _id: string;
    departmentName: string;
    description: string;
  };
  subCategories: {
    returnName: string;
    frequency: string;
    description?: string;
    dueAfter?: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface IDepartmentTable {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IClient {
  name: string;
  clientType: string;
  email: string;
  aadhaar: string;
  pan: string;
  gst: string;
  tan: string;
  cin: string;
  mobile: string;
  organizationName: string;
  organizationType: string;
  address: string;
  contactPerson: {
    name: string;
    mobile: string;
    email: string;
  };
  directors: Array<{
    name: string;
    din: string;
    aadhaar: string;
  }>;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  portalName: string;
  portalId: string;
  portalPassword: string;
  files?: FileList;
  services: Array<string>;
}
export interface IOrganizationConfig {
  settings: IOrganizationConfigSettings[];
}
interface IOrganizationConfigSettings {
  id: string;
  value: string;
  description?: string;
}
