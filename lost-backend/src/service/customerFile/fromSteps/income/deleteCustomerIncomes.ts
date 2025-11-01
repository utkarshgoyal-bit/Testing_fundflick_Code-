import { Types } from 'mongoose';
import customerFileSchema from '../../../../schema/customerFile';
import { ERROR } from '../../../../shared/enums';
const deleteCustomerIncomes = async ({
  id,
  IncomeId,
  loginUser,
}: {
  id: string;
  IncomeId: string;
  loginUser: any;
}) => {
  const customerFile = await customerFileSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(id), organization: loginUser.organization._id },
    {
      $pull: {
        customerOtherFamilyDetails: { _id: new Types.ObjectId(IncomeId) },
      },
    },
    {
      new: true,
      upsert: false,
      runValidators: true,
    }
  );
  if (!customerFile) {
    throw ERROR.NOT_FOUND;
  }
  return true;
};

export default deleteCustomerIncomes;
