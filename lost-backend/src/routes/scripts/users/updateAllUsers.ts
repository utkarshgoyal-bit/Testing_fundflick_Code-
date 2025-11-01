import { Request, Response } from 'express';
import Logger from '../../../lib/logger';
import { UserSchema } from '../../../schema';

const updateAllUsers = async (req: Request, res: Response) => {
  try {
    const {
      loginUser: { organization: orgId },
    } = req;
    if (!orgId) {
      return res.status(400).json({ message: 'orgId is required' });
    }
    const result = await UserSchema.updateMany({}, { MONGO_DELETED: false });
    res.status(200).json({ message: result || 'All users updated successfully' });
  } catch (error) {
    const err = error as { message?: string };
    res.status(500).json({ message: err?.message || 'Internal server error' });
    Logger.error(error);
  }
};
export default updateAllUsers;
