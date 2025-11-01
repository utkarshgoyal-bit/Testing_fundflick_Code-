import { Types } from 'mongoose';
import TelephoneQuestionSchema from '../../schema/telephoneQuestions';
import { COMPONENTS, ERROR } from '../../shared/enums';

const addTelephoneQuestion = async ({ body, loginUser }: { body: any; loginUser: any }) => {
  const isExist = await TelephoneQuestionSchema.findOne({
    question: body.question,
    isDeleted: false,
    organization: loginUser.organization._id,
  });
  if (isExist) {
    throw COMPONENTS.TELEPHONE_QUESTION + ERROR.ALREADY_EXISTS;
  }
  body.createdBy = new Types.ObjectId(loginUser._id);
  body.organization = loginUser.organization._id;

  const telephoneQuestion = new TelephoneQuestionSchema({ ...body, isDeleted: false });
  await telephoneQuestion.save();
  return telephoneQuestion;
};

export default addTelephoneQuestion;
