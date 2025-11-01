import { Request, Response } from 'express';
import Logger from '../../../lib/logger';
import { EmployeeSchema } from '../../../schema';

const updateAllEmployeesJoiningDate = async (req: Request, res: Response) => {
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
        if (!employee.joiningDate) {
          updateResults.skipped.push({
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            reason: 'Joining Date field is missing',
          });
          continue;
        }

        if (typeof employee.joiningDate === 'number') {
          updateResults.alreadyTimestamp.push({
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            joiningDate: employee.joiningDate,
            readableDate: new Date(employee.joiningDate).toISOString().split('T')[0],
          });
          continue;
        }

        const jdString = String(employee.joiningDate).trim();
        const jdTimestamp = new Date(jdString).getTime();

        if (isNaN(jdTimestamp)) {
          updateResults.errors.push({
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            originalJoiningDate: employee.joiningDate,
            error: 'Invalid date format',
          });
          continue;
        }

        await EmployeeSchema.updateOne(
          { _id: employee._id },
          { $set: { joiningDate: jdTimestamp } }
        );

        updateResults.converted.push({
          id: employee._id,
          name: `${employee.firstName} ${employee.lastName}`,
          originalJoiningDate: jdString,
          convertedJoiningDate: jdTimestamp,
          readableDate: new Date(jdTimestamp).toISOString().split('T')[0],
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
      message: 'All employees Joining Date conversion completed',
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

export default updateAllEmployeesJoiningDate;
