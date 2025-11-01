import connectDB from '../../db';
import { getTaskCounter, resetAllTaskCounters } from '../../utils/generateTaskId';

async function runResetTaskCounter() {
  try {
    // Connect to database
    await connectDB();

    // Replace with your actual organization ID
    const organizationId = '68f375cc9996704a7d53ed32';

    // Get current counter values
    const regularCount = await getTaskCounter(organizationId, false);
    const bulkCount = await getTaskCounter(organizationId, true);

    console.log(`Current regular task counter: ${regularCount}`);
    console.log(`Current bulk task counter: ${bulkCount}`);

    // Choose what to reset:
    // Option 1: Reset both counters
    await resetAllTaskCounters(organizationId, 0);
    console.log('Both task counters have been reset successfully!');

    // Option 2: Reset only regular tasks
    // await resetTaskCounter(organizationId, 0, false);
    // console.log('Regular task counter has been reset successfully!');

    // Option 3: Reset only bulk tasks
    // await resetTaskCounter(organizationId, 0, true);
    // console.log('Bulk task counter has been reset successfully!');

    // Verify reset
    const newRegularCount = await getTaskCounter(organizationId, false);
    const newBulkCount = await getTaskCounter(organizationId, true);

    console.log(`New regular task counter: ${newRegularCount}`);
    console.log(`New bulk task counter: ${newBulkCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error resetting task counter:', error);
    process.exit(1);
  }
}

runResetTaskCounter();
