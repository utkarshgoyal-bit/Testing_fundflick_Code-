import { NavigateFunction } from 'react-router-dom';
import { TASK_STATUS } from '../enums';

export interface ITask {
  _id: string;
  taskId: string;
  createdBy: {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
  };
  employeeId: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  startDate: Date;
  dueDate: Date;
  title: string;
  fileId: string;
  description: string;
  repeat: string;
}
// export interface ITaskItem {
//   createdBy: ICreatedBy;
//   employeeId: IItememployeeId;
//   _id: string;
//   repeat: string;
// }

// export interface ICreatedBy {
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   _id: string;
// }
// export interface IItememployeeId {
//   middleName: string;
//   firstName: string;
//   lastName: string;
// }

export interface TasksAction {
  type: string;
  payload: {
    taskName: string;
    title: string;
    description: string;
    fileId: number;
    taskId: number;
  };
  navigation: NavigateFunction;
}
export interface ServiceAction {
  type: string;
  payload: {
    _id?: string;
    serviceName: string;
    departmentId: string;
    subCategories: {
      returnName: string;
      description?: string;
    }[];
  };
  navigation: NavigateFunction;
}

export interface ClientAction {
  type: string;
  payload: {
    _id?: string;
    name: string;
    serviceId: string;
    clientType: 'individual' | 'business';

    individualDetails?: {
      name?: string;
      panNo?: string;
      gstNo?: string;
      tanNo?: string;
      address?: string;
      email?: string;
      phone?: string;
    };

    businessDetails?: {
      businessName?: string;
      businessType?: 'llp' | 'pvtLtd' | 'proprietorship' | 'partnership' | 'other';
      panNo?: string;
      cinNo?: string;
      gstNo?: string;
      tanNo?: string;
      address?: string;
      companyEmail?: string;
      companyPhone?: string;
    };

    contactPerson?: {
      name?: string;
      email?: string;
      phone?: string;
      designation?: string;
    };

    additionalInfo?: {
      bankInfo?: {
        bankName?: string;
        accountNumber?: string;
        ifscCode?: string;
        branch?: string;
      };
      partnersDetails?: Array<{
        name?: string;
        aadhaarNo?: string;
        dinNo?: string;
      }>;
    };

    documentUrl?: string;
  };
  navigation: NavigateFunction;
}

export interface TaskDashboard {
  completedTasks: number;
  incompleteTasks: number;
  totalTasks: number;
  assignedToMeTasks: number;
  dueTodayTasks: number;
  priorityWiseIncompleteTasks: {
    high: number;
    medium: number;
    low: number;
  };
  statusWiseTasks: {
    pending: number;
    inProgress: number;
    underReview: number;
    rejected: number;
    onHold: number;
    completed: number;
    scheduled: number;
    overdue: number;
  };
  teamTasks?: {
    users: { employeeId: string; name: string }[];
    status: keyof typeof TASK_STATUS;
    acceptedBy: string;
  }[];
}

export interface ClientLedgerData {
  _id: string;
  title: string;
  serviceId: {
    _id: string;
    serviceName: string;
  };
  clientId: {
    _id: string;
    name: string;
  };
  dateOfCompletion: number;
  completedBy: {
    firstName: string;
    lastName: string;
  };
  paymentStatus: 'Pending' | 'Invoice Sent' | 'Received';
  timeline: {
    title: string;
    date: number;
    remark: string;
    amountReceived: number;
    createdAt: number;
    createdBy: string;
    _id: string;
  }[];
}

export interface SelectedClientLedger {
  _id: string;
  title: string;
  serviceId: string;
  clientId: string;
  dateOfCompletion: number;
  completedBy: string;
  paymentStatus: 'Pending' | 'Invoice Sent' | 'Received';
  timeline: {
    status: 'Invoice Sent' | 'Received';
    date: number;
    remark: string;
    amount: number;
    createdAt: number;
  }[];
}

export interface ClientLedgerAction {
  type: string;
  payload: {
    ledgerId?: string;
    clientId?: string;
    from?: string;
    to?: string;
    departmentId?: string;
  };
  navigation: NavigateFunction;
}
export interface ClientLedgerAction {
  type: string;
  payload: {
    ledgerId?: string;
    clientId?: string;
    from?: string;
    to?: string;
    departmentId?: string;
  };
  navigation: NavigateFunction;
}

export interface UpdateClientLedgerAction {
  type: string;
  payload: {
    ledgerId: string;
    status: string;
    date: number;
    remark: string;
    amountReceived: number;
  };
}
export interface BulkTaskFormProps {
  onSubmitTask?: (data: any) => void;
}
export interface MyFormValues {
  department: string;
  service: string;
  users: string[];
  description: string;
  repeat: 'noRepeat' | 'weekly' | 'monthly' | 'yearly';
  weeklyDay: string;
  monthlyDay: string;
  yearlyMonth: string;
  yearlyDay: string;
  startDate: number;
  dueAfterDays: number;
}
