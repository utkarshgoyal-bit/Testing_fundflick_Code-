import { Types } from 'mongoose';
import TelephoneQuestionSchema from '../../schema/telephoneQuestions';

const editTelephoneQuestion = async (body: any, loginUser: any) => {
  const updatedTelephoneQuestion = await TelephoneQuestionSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(body.id),
      organization: loginUser.organization._id,
    },
    body,
    {
      new: true,
      upsert: false,
    }
  );

  if (!updatedTelephoneQuestion) {
    throw new Error('Telephone Question not found');
  }

  return updatedTelephoneQuestion;
};

export default editTelephoneQuestion;
