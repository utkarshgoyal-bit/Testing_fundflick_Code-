import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;
const telephoneQuestions = new Schema({
  organization: {
    type: Types.ObjectId,
    required: true,
    ref: 'organization',
  },
  question: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
  },
  updatedAt: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});
telephoneQuestions.index({ question: 1, organization: 1 }, { unique: true });
const TelephoneQuestionsModel = model('telephoneQuestions', telephoneQuestions);
export default TelephoneQuestionsModel;
