import mongoose from 'mongoose';

const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;

/**
 * Counter Schema for atomic sequence generation
 * Used to generate unique sequential numbers per organization
 */
const counterSchema = new Schema({
  organization: {
    type: Types.ObjectId,
    required: true,
    ref: 'organization',
    index: true,
  },
  sequenceName: {
    type: Types.String,
    required: true,
    index: true,
  },
  value: {
    type: Types.Number,
    default: 0,
  },
});

// Compound unique index to ensure one counter per org + sequence combination
counterSchema.index({ organization: 1, sequenceName: 1 }, { unique: true });

const Counter = model('Counter', counterSchema);
export default Counter;
