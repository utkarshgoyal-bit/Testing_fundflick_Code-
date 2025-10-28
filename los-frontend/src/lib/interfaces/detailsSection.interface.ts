/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IDetailsSection {
  loanDetails: any;
  isSuperAdmin?: boolean;
  isCollectionHead?: boolean;
};
export interface FollowUpData {
  _id: string;
  refCaseId: string;
  visitType: string;
  date: string;
  dateTimeStamp: number;
  dateEndTimeStamp: number;
  commit: string;
  commitTimeStamp: number;
  commitEndTimeStamp: number;
  remarks: string;
  attitude: string;
  createdBy: string;
  noReply: boolean;
  caseNo: string;
  userId: string;
  os: string;
  employeeId: string;
  createdAtTimeStamp: number;
  updatedAtTimeStamp: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}