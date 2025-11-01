import CounterSchema from '../schema/counter';

export async function generateTaskId(
  organizationId: string,
  orgName: string,
  isBulkTask?: boolean
): Promise<string> {
  // Create a clean organization prefix (first 3-4 characters, uppercase, no spaces)
  const orgPrefix = orgName.replace(/\s+/g, '').toUpperCase().substring(0, 4);

  // Counter identifier for task sequence per organization
  // Use different counter for bulk tasks vs regular tasks
  const counterId = isBulkTask ? `bulk_task_${organizationId}` : `task_${organizationId}`;

  // Get and increment the counter atomically
  const counter = await CounterSchema.findOneAndUpdate(
    { _id: counterId, organizationId },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  // Generate task ID:
  // Regular tasks: MAIT-0001, MAIT-0002
  // Bulk tasks: MAIT-BULK-0001, MAIT-BULK-0002
  const taskId = isBulkTask
    ? `${orgPrefix}-BULK-${counter.sequence.toString().padStart(4, '0')}`
    : `${orgPrefix}-${counter.sequence.toString().padStart(4, '0')}`;

  return taskId;
}

export async function resetTaskCounter(
  organizationId: string,
  resetValue: number = 0,
  isBulkTask?: boolean
): Promise<void> {
  const counterId = isBulkTask ? `bulk_task_${organizationId}` : `task_${organizationId}`;

  await CounterSchema.findOneAndUpdate(
    { _id: counterId, organizationId },
    { sequence: resetValue },
    {
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function getTaskCounter(
  organizationId: string,
  isBulkTask?: boolean
): Promise<number> {
  const counterId = isBulkTask ? `bulk_task_${organizationId}` : `task_${organizationId}`;

  const counter = await CounterSchema.findOne({ _id: counterId, organizationId });
  return counter?.sequence || 0;
}

export async function resetAllTaskCounters(
  organizationId: string,
  resetValue: number = 0
): Promise<void> {
  // Reset both regular and bulk task counters
  await Promise.all([
    resetTaskCounter(organizationId, resetValue, false), // Regular tasks
    resetTaskCounter(organizationId, resetValue, true), // Bulk tasks
  ]);
}
