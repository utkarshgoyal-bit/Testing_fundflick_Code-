import { Types } from 'mongoose';
import Counter from '../../schema/counter';
import CustomerFileModel from '../../schema/customerFile';

/**
 * Generates the next loan application number for a given organization.
 *
 * This function uses an atomic counter to generate unique sequential loan numbers.
 * It's safe for concurrent requests and prevents duplicate key errors.
 *
 * Each organization has its own independent sequence starting from 1.
 *
 * @param organizationId - The MongoDB ObjectId of the organization
 * @returns Promise<number> - The next loan application number to use
 */
const generateLoanNumber = async (organizationId: Types.ObjectId): Promise<number> => {
  const SEQUENCE_NAME = 'loanApplicationNumber';

  try {
    // First, try to increment existing counter
    const counter = await Counter.findOneAndUpdate(
      {
        organization: organizationId,
        sequenceName: SEQUENCE_NAME,
      },
      {
        $inc: { value: 1 },
      },
      {
        new: true,
        upsert: false, // Don't create if doesn't exist
      }
    );

    if (counter) {
      return counter.value;
    }

    // Counter doesn't exist, initialize it
    // Check existing files to get the starting number
    const highestLoanFile = await CustomerFileModel
      .findOne({ organization: organizationId })
      .sort({ loanApplicationNumber: -1 })
      .select('loanApplicationNumber')
      .lean();

    const startValue = highestLoanFile?.loanApplicationNumber || 0;

    // Create the counter with initial value
    try {
      const newCounter = await Counter.create({
        organization: organizationId,
        sequenceName: SEQUENCE_NAME,
        value: startValue + 1,
      });

      return newCounter.value;
    } catch (error: any) {
      // Handle race condition: another request created the counter
      if (error.code === 11000) {
        // Counter was created by another request, try increment again
        const retryCounter = await Counter.findOneAndUpdate(
          {
            organization: organizationId,
            sequenceName: SEQUENCE_NAME,
          },
          {
            $inc: { value: 1 },
          },
          {
            new: true,
          }
        );

        if (retryCounter) {
          return retryCounter.value;
        }
      }
      throw error;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating loan number:', error);
    throw error;
  }
};

export default generateLoanNumber;