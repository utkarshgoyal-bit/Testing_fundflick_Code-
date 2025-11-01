import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const userSchema = new Schema({
  employeeId: {
    type: Types.ObjectId,
    ref: 'Employeesv2',
    required: true,
  },
  password: {
    type: String,
    trim: true,
  },
  role: {
    type: Types.String,
  },
  roleRef: {
    type: Types.ObjectId,
    ref: 'roles',
  },
  avatar: {
    type: Types.String,
    required: false,
  },
  branches: {
    type: [Types.String],
    required: true,
  },
  loggedIn: {
    type: Types.Number,
    required: false,
  },
  ledgerBalance: {
    type: Types.Number,
    required: true,
    default: 0,
  },
  ledgerBalanceHistory: {
    type: [
      {
        ledgerBalance: Types.Number,
        date: Types.Date,
        remarks: Types.String,
        type: {
          type: Types.String,
          enum: ['credit', 'debit'],
        },
      },
    ],
    default: [],
  },
  loggedFrom: {
    type: Types.String,
    required: false,
  },
  isActive: {
    type: Types.Boolean,
    required: true,
  },
  createdAt: {
    type: Types.Number,
    required: true,
    default: new Date(),
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'Employeesv2',
  },
  updatedAt: {
    type: Types.Number,
    required: true,
    default: new Date(),
  },
  organizations: [
    {
      type: Types.ObjectId,
      required: true,
      ref: 'organization',
    },
  ],
  fcmToken: {
    type: Types.String,
    required: false,
    default: '',
  },
  os: {
    type: Types.String,
    required: false,
  },
  browser: {
    type: Types.String,
    required: false,
  },
  pinnedTask: [
    {
      type: Types.ObjectId,
      ref: 'tasksv2',
    },
  ],
  MONGO_DELETED: {
    type: Types.Boolean,
    required: true,
    default: false,
  },
});
userSchema.index({ employeeId: 1 }, { unique: true });
const UserSchema = model('usersv2', userSchema);
export default UserSchema;
