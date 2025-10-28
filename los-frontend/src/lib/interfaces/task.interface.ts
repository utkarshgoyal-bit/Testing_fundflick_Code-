import { NavigateFunction } from 'react-router-dom';

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
      frequency: string;
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
}
