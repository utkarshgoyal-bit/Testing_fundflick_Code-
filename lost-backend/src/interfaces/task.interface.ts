import { Types } from 'mongoose';

export interface IAddTaskPayload {
  title: string;
  description?: string;
  type: string;
  caseNo?: string;
  dueDate?: Date;
  serviceId?: string | Types.ObjectId;
  clientId?: string | Types.ObjectId;
  returnName?: string;
  priority?: string;
  users: (string | Types.ObjectId | { employeeId: string | Types.ObjectId })[];
  attachments?: string[];
  startDate?: Date;
  dueAfterDays?: number;
  repeat?: string;
  weeklyDay?: string;
  monthlyDay?: number;
  yearlyMonth?: number;
  yearlyDay?: number;
  createdBy: string | Types.ObjectId;
  clientsIds?: (string | Types.ObjectId)[];
}

export interface ITaskDashboard {
  completedTasks: number;
  incompleteTasks: number;
  totalTasks: number;
  assignedToMeTasks: number;
  dueTodayTasks: number;
  teamTasks?: unknown[];
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
    upcoming: number;
    overdue: number;
  };
}
