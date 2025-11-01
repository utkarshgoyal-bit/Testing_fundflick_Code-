import { Document, Types } from 'mongoose';

export interface ICustomer extends Document {
  _id: Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName?: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  altphone?: string;
  email?: string;
  uidFront: string;
  uidBack: string;
  aadhaarNumber: string;
  personalPan?: string;
  voterId?: string;
  otherId?: string;
  nationality?: string;
  religion?: string;
  education?: string;
  maritalStatus?: string;
  hasExtraDetails: boolean;
  isActive: boolean;
  createdAt: Date;
  createdBy: Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
  organization: {
    type: Types.ObjectId;
    required: true;
    ref: 'organization';
  };
}
