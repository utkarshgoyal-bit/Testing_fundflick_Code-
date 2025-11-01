import { Request, Response } from 'express';
import moment from 'moment';
import Logger from '../../../lib/logger';
import { EmployeeSchema } from '../../../schema';
const updateAllEmployeesDob = async (req: Request, res: Response) => {
  try {
    const {
      loginUser: { organization: orgId },
    } = req;
    if (!orgId) {
      return res.status(400).json({ message: 'orgId is required' });
    }
    const allEmployees = await EmployeeSchema.find({ organization: orgId }).lean();

    const updateResults = {
      alreadyTimestamp: [] as any[],
      converted: [] as any[],
      skipped: [] as any[],
      errors: [] as any[],
    };

    for (const employee of allEmployees) {
      try {
        if (!employee.dob) {
          updateResults.skipped.push({
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            reason: 'DOB field is missing',
          });
          continue;
        }

        if (typeof employee.dob === 'number') {
          updateResults.alreadyTimestamp.push({
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            dob: employee.dob,
            readableDate: moment(employee.dob).tz('Asia/Kolkata').format('DD-MM-YYYY'),
          });
          continue;
        }

        // Convert string DOB to milliseconds
        const dobString = String(employee.dob).trim();
        const dobTimestamp = moment.utc(dobString, 'YYYY-MM-DD').startOf('day').valueOf();

        // Validate timestamp
        if (isNaN(dobTimestamp)) {
          updateResults.errors.push({
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            originalDob: employee.dob,
            error: 'Invalid date format',
          });
          continue;
        }

        // Update employee
        await EmployeeSchema.updateOne({ _id: employee._id }, { $set: { dob: dobTimestamp } });

        updateResults.converted.push({
          id: employee._id,
          name: `${employee.firstName} ${employee.lastName}`,
          originalDob: dobString,
          convertedDob: dobTimestamp,
          readableDate: moment(dobTimestamp).tz('Asia/Kolkata').format('DD-MM-YYYY'),
        });
      } catch (err) {
        updateResults.errors.push({
          id: employee._id,
          name: `${employee.firstName} ${employee.lastName}`,
          error: (err as Error).message,
        });
      }
    }

    res.status(200).json({
      message: 'All employees DOB conversion completed',
      summary: {
        totalProcessed: allEmployees.length,
        alreadyTimestamp: updateResults.alreadyTimestamp.length,
        converted: updateResults.converted.length,
        skipped: updateResults.skipped.length,
        errors: updateResults.errors.length,
      },
      details: updateResults,
    });
  } catch (error) {
    const err = error as { message?: string };
    res.status(500).json({ message: err?.message || 'Internal server error' });
    Logger.error(error);
  }
};

export default updateAllEmployeesDob;
