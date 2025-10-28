export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  eId: string;
  email: string;
  designation: string;
  role: string;
  sex: string;
  dob: string; // date of birth
  maritalStatus: string;
  qualification: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  mobile: string;
  uid: string; // unique identifier
  pan: string; // permanent account number
  passport: string;
  voterID: string;
  drivingLicense: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string; // ID of the user who created the employee
  updatedAt: Date;
  orgName: string;
  __v: number; // version number
}
