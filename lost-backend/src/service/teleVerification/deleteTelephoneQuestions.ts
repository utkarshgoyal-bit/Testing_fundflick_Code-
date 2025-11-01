import { Types } from 'mongoose';
import TelephoneQuestionSchema from '../../schema/telephoneQuestions';

const deleteTelephoneQuestion = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const deletedTelephoneQuestion = await TelephoneQuestionSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(id),
      organization: loginUser.organization._id,
    },
    { isDeleted: true },
    {
      new: true,
      upsert: false,
    }
  );
  if (!deletedTelephoneQuestion) {
    throw 'Telephone Question not found';
  }
  return deletedTelephoneQuestion;
};

export default deleteTelephoneQuestion;
