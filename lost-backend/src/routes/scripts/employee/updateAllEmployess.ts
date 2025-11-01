import { Request, Response } from 'express';
import Logger from '../../../lib/logger';
import { EmployeeSchema } from '../../../schema';

const updateAllEmployess = async (req: Request, res: Response) => {
  try {
    const {
      loginUser: { organization: orgId },
    } = req;
    if (!orgId) {
      return res.status(400).json({ message: 'orgId is required' });
    }

    const result = await EmployeeSchema.updateMany({}, { MONGO_DELETED: false });
    res.status(200).json({ message: result || 'All employees updated successfully' });
  } catch (error) {
    const err = error as { message?: string };
    res.status(500).json({ message: err?.message || 'Internal server error' });
    Logger.error(error);
  }
};

export default updateAllEmployess;
