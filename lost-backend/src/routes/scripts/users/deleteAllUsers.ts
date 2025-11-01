import { Request, Response } from 'express';
import mongoose from 'mongoose';

import UserSchema from '../../../schema/auth';
const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const isDev = process.env.DB_ENV === 'development';
    if (!isDev) {
      return res.status(400).json({ message: 'This route is only available in dev environment' });
    }
    await UserSchema.deleteMany({
      _id: { $ne: new mongoose.Types.ObjectId('672048c17c99879816d8c27e') },
    });
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    const err = error as { message?: string };
    res.status(500).json({ message: err?.message || 'Internal server error' });
  }
};
export default deleteAllUsers;
