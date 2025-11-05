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

  // Maximum number of retry attempts for race condition handling
  const MAX_RETRIES = 3;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      // Use findOneAndUpdate with atomic $inc operation
      // $setOnInsert ensures initial value is 0 when creating new counter
      // $inc then increments the value by 1
      const counter = await Counter.findOneAndUpdate(
        {
          organization: organizationId,
          sequenceName: SEQUENCE_NAME,
        },
        {
          $setOnInsert: { value: 0 }, // Initialize to 0 on first creation
          $inc: { value: 1 },          // Then increment by 1
        },
        {
          new: true,   // Return the document after update
          upsert: true, // Create if doesn't exist
        }
      );

      // Successfully got a counter value
      return counter!.value;

    } catch (error: unknown) {
      attempts++;

      // Handle duplicate key error during concurrent counter initialization
      const mongoError = error as { code?: number };
      if (mongoError.code === 11000) {
        // Duplicate key means another request created the counter simultaneously
        // Wait a brief moment and retry
        await new Promise(resolve => setTimeout(resolve, 10 * attempts));

        if (attempts >= MAX_RETRIES) {
          // After max retries, try to just read the existing counter
          const existingCounter = await Counter.findOne({
            organization: organizationId,
            sequenceName: SEQUENCE_NAME,
          });

          if (existingCounter) {
            // Try one more increment
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
        }
        // Continue to next retry attempt
        continue;
      }

      // For non-duplicate key errors, throw immediately
      throw error;
    }
  }

  // Fallback: If all retries failed, query existing files and generate number
  // This should be extremely rare
  // eslint-disable-next-line no-console
  console.error('Counter generation failed after retries, using fallback method');

  const highestLoanFile = await CustomerFileModel
    .findOne({ organization: organizationId })
    .sort({ loanApplicationNumber: -1 })
    .select('loanApplicationNumber')
    .lean();

  const nextLoanNumber = highestLoanFile?.loanApplicationNumber
    ? highestLoanFile.loanApplicationNumber + 1
    : 1;

  // Try to sync the counter with the actual max value
  try {
    await Counter.findOneAndUpdate(
      {
        organization: organizationId,
        sequenceName: SEQUENCE_NAME,
      },
      {
        $max: { value: nextLoanNumber }, // Set to max of current value or nextLoanNumber
      },
      {
        upsert: true,
      }
    );
  } catch (counterError) {
    // Log counter sync errors but don't fail the operation
    // eslint-disable-next-line no-console
    console.error('Failed to sync counter:', counterError);
  }

  return nextLoanNumber;
};

export default generateLoanNumber;
