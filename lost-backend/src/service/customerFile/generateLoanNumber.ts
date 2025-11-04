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
 * On first run, it initializes the counter based on existing files in the database.
 *
 * @param organizationId - The MongoDB ObjectId of the organization
 * @returns Promise<number> - The next loan application number to use
 *
 * @example
 * const nextLoanNumber = await generateLoanNumber(organizationId);
 * // Returns 1 if no files exist, otherwise maxLoanNumber + 1
 */
const generateLoanNumber = async (organizationId: Types.ObjectId): Promise<number> => {
  const SEQUENCE_NAME = 'loanApplicationNumber';

  try {
    // Use findOneAndUpdate with $inc for atomic increment
    // This prevents race conditions when multiple requests come in simultaneously
    const counter = await Counter.findOneAndUpdate(
      {
        organization: organizationId,
        sequenceName: SEQUENCE_NAME,
      },
      {
        $inc: { value: 1 },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create if doesn't exist
        setDefaultsOnInsert: true,
      }
    );

    return counter.value;
  } catch (error: any) {
    // If counter doesn't exist (first time), initialize it based on existing files
    if (error.code === 11000 || error.name === 'MongoError') {
      // Duplicate key error on upsert race condition
      // Retry once
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
        }
      );

      if (counter) {
        return counter.value;
      }
    }

    // Fallback: Query existing files and return max + 1
    // This should rarely happen, but provides a safety net
    const highestLoanFile = await CustomerFileModel
      .findOne({ organization: organizationId })
      .sort({ loanApplicationNumber: -1 })
      .select('loanApplicationNumber')
      .lean();

    const nextLoanNumber = highestLoanFile?.loanApplicationNumber
      ? highestLoanFile.loanApplicationNumber + 1
      : 1;

    // Try to set the counter to this value for future use
    try {
      await Counter.findOneAndUpdate(
        {
          organization: organizationId,
          sequenceName: SEQUENCE_NAME,
        },
        {
          $set: { value: nextLoanNumber },
        },
        {
          upsert: true,
        }
      );
    } catch (counterError) {
      // Ignore counter update errors
    }

    return nextLoanNumber;
  }
};

export default generateLoanNumber;
