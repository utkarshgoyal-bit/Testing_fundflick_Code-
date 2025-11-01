import { Types } from 'mongoose';
export interface AddClientPayload {
  name: string;
  services: Types.ObjectId[];
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
}
export interface UpdateClientPayload {
  id: string;
  name: string;
  serviceId: Types.ObjectId;
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
}
