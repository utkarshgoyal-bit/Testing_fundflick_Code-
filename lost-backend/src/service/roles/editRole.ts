import { Types } from 'mongoose';
import RolesSchema from '../../schema/roles';

const editRole = async ({ id, data, loginUser }: { data: any; id: string; loginUser: any }) => {
  const role = await RolesSchema.findOneAndUpdate(
    { _id: new Types.ObjectId(id), organization: loginUser.organization._id },
    data,
    {
      new: true,
      upsert: false,
    }
  );
  return role;
};

export default editRole;
