import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const counterSchema = new Schema({
  _id: { type: String, required: true },
  organizationId: { type: Schema.Types.ObjectId, required: true, ref: 'organization' },
  sequence: { type: Number, default: 0 },
});

counterSchema.index({ _id: 1, organizationId: 1 }, { unique: true });

const CounterSchema = model('Counter', counterSchema);

export default CounterSchema;
