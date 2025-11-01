import { Request, Response } from 'express';
import TasksSchema from '../../../schema/tasks';

const deleteAllTasks = async (req: Request, res: Response) => {
  const {
    loginUser: { organization: orgId },
  } = req;
  const isDev = process.env.DB_ENV === 'development';
  if (!isDev) {
    return res.status(400).json({ message: 'This route is only available in dev environment' });
  }
  try {
    if (!orgId) {
      return res.status(400).json({ message: 'orgId is required' });
    }
    await TasksSchema.deleteMany({ organizationId: orgId });
    return res.status(200).json({ message: 'All tasks deleted successfully' });
  } catch (err) {
    const error = err as { message?: string };
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
};
export default deleteAllTasks;
