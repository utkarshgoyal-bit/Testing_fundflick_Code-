import { Types } from 'mongoose';
import { LoginUser } from '../../interfaces';
import TelephoneQuestionSchema from '../../schema/telephoneQuestions';

const getTelephoneQuestionById = async ({
  id,
  loginUser,
}: {
  id: string;
  loginUser: LoginUser;
}) => {
  const telephoneQuestion = await TelephoneQuestionSchema.findById({
    _id: new Types.ObjectId(id),
    organization: loginUser.organization._id,
  });
  if (!telephoneQuestion) {
    throw 'Telephone Question not found';
  }
  return telephoneQuestion;
};

export default getTelephoneQuestionById;
