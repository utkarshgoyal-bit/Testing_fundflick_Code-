import { Request, Response } from 'express';
import { resetTaskCounter, getTaskCounter } from '../../utils/generateTaskId';

export const resetTaskCounterController = async (req: Request, res: Response) => {
  try {
    const { organizationId, resetValue = 0 } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    // Get current counter value
    const currentCount = await getTaskCounter(organizationId);

    // Reset counter
    await resetTaskCounter(organizationId, resetValue);

    // Get new counter value
    const newCount = await getTaskCounter(organizationId);

    res.json({
      message: 'Task counter reset successfully',
      previousCount: currentCount,
      newCount: newCount,
      organizationId,
    });
  } catch (error) {
    console.error('Error resetting task counter:', error);
    res.status(500).json({ error: 'Failed to reset task counter' });
  }
};
