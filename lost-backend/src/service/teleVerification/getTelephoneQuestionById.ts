import { Types } from "mongoose";
import TelephoneQuestionSchema from "../../models/telephoneQuestions";

const getTelephoneQuestionById = async ({ id, loginUser }: { id: string; loginUser: any }) => {
  const telephoneQuestion = await TelephoneQuestionSchema.findById({
    _id: new Types.ObjectId(id),
    organization: loginUser.organization._id,
  });
  if (!telephoneQuestion) {
    throw "Telephone Question not found";
  }
  return telephoneQuestion;
};

export default getTelephoneQuestionById;
