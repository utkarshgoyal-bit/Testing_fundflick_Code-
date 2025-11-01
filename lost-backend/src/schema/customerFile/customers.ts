import mongoose, { Schema, Types } from 'mongoose';
import { ICustomer } from '../../interfaces/customer.interface';

// Define the interface for the customer document

// Create the schema
const customerSchema = new Schema<ICustomer>(
  {
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: 'organization',
    },
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dob: {
      type: String,
      required: [true, 'Date of Birth is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required'],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, 'Phone number is required'],
    },
    altphone: {
      type: String,
    },
    email: {
      type: String,
    },
    uidFront: {
      type: String,
      required: [true, 'UID Front URL is required'],
    },
    uidBack: {
      type: String,
      required: [true, 'UID Back URL is required'],
    },
    aadhaarNumber: {
      type: String,
      required: [true, 'Aadhaar Number is required'],
      unique: true,
    },
    personalPan: {
      type: String,
      validate: {
        validator: async function (this: any, v?: string) {
          // Only validate if personalPan has actually been changed
          if (v && v !== this.personalPan) {
            const existingCustomer = await CustomerDetails.findOne({ personalPan: v });
            if (
              existingCustomer &&
              existingCustomer.aadhaarNumber !== this._update.$set.aadhaarNumber
            ) {
              throw new Error('This PAN is already associated with another Aadhaar Number.');
            }
          }
        },
        message: 'PAN must be unique and linked to only one Aadhaar.',
      },
    },
    voterId: {
      type: String,
    },
    otherId: {
      type: String,
    },
    nationality: {
      type: String,
    },
    religion: {
      type: String,
    },
    education: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    hasExtraDetails: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

// Create a compound unique index for PAN and Aadhaar Number to enforce uniqueness of PAN only when present
customerSchema.index(
  { personalPan: 1, aadhaarNumber: 1 },
  { unique: true, partialFilterExpression: { personalPan: { $exists: true } } }
);

// Create and export the model
const CustomerDetails = mongoose.model<ICustomer>('customerv2', customerSchema);

export default CustomerDetails;
