import { Types } from 'mongoose';
import customerFileSchema from '../../../../schema/customerFile';
import { ERROR } from '../../../../shared/enums';

const deleteCustomerAssociates = async ({
  id,
  associateId,
  loginUser,
}: {
  id: string;
  associateId: string;
  loginUser: any;
}) => {
  const customerFile = await customerFileSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(id), organization: loginUser.organization._id },
    {
      $pull: {
        customerOtherFamilyDetails: { _id: new Types.ObjectId(associateId) },
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

export default deleteCustomerAssociates;
