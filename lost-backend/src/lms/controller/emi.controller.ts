/* eslint-disable no-console */
import { Request, Response } from 'express';
import { EMIScheduleService } from '../service/emiSchedule.service';
import { EMICalculationService } from '../service/emiCalculation.service';
import { EMIModel } from '../models/emi.model';
import { z } from 'zod';

// Validation schemas
const generateEMIScheduleSchema = z.object({
  loanId: z.number().positive(),
  startDate: z.string().datetime().optional(),
  regenerate: z.boolean().optional().default(false),
});

const calculateEMISchema = z.object({
  principalAmount: z.number().positive(),
  interestRate: z.number().min(0).max(100),
  tenure: z.number().positive().max(600),
  startDate: z.string().datetime().optional(),
});

const emiPaymentSchema = z.object({
  emiId: z.number().positive(),
  paidAmount: z.number().positive(),
  paymentDate: z.string().datetime().optional(),
});

export class EMIController {
  /**
   * Calculate EMI amount and generate schedule (without saving to database)
   */
  static async calculateEMI(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = calculateEMISchema.parse(req.body);

      const validationErrors = EMICalculationService.validateEMIInputs({
        principalAmount: validatedData.principalAmount,
        interestRate: validatedData.interestRate,
        tenure: validatedData.tenure,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
      });

      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          errors: validationErrors,
        });
        return;
      }

      const result = EMICalculationService.generateEMISchedule({
        principalAmount: validatedData.principalAmount,
        interestRate: validatedData.interestRate,
        tenure: validatedData.tenure,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
      });

      const summary = EMICalculationService.getEMISummary(result.schedule);

      res.status(200).json({
        success: true,
        data: {
          emiAmount: result.emiAmount,
          totalInterest: result.totalInterest,
          totalAmount: result.totalAmount,
          summary,
          schedule: result.schedule,
        },
      });
    } catch (error) {
      console.error('Calculate EMI Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate EMI',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Generate EMI schedule for a loan and save to database
   */
  static async generateEMISchedule(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = generateEMIScheduleSchema.parse(req.body);

      const emiSchedule = await EMIScheduleService.generateEMISchedule({
        loanId: validatedData.loanId,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        regenerate: validatedData.regenerate,
      });

      res.status(201).json({
        success: true,
        message: 'EMI schedule generated successfully',
        data: emiSchedule,
      });
    } catch (error) {
      console.error('Generate EMI Schedule Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate EMI schedule',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get EMI schedule for a loan
   */
  static async getEMISchedule(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const emiSchedule = await EMIScheduleService.getEMIScheduleWithLoan(loanId);
      const summary = await EMIScheduleService.getEMISummary(loanId);

      res.status(200).json({
        success: true,
        data: {
          schedule: emiSchedule,
          summary,
        },
      });
    } catch (error) {
      console.error('Get EMI Schedule Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve EMI schedule',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get pending EMIs for a loan
   */
  static async getPendingEMIs(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const pendingEMIs = await EMIModel.getPendingEMIs(loanId);

      res.status(200).json({
        success: true,
        data: pendingEMIs,
      });
    } catch (error) {
      console.error('Get Pending EMIs Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve pending EMIs',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get overdue EMIs
   */
  static async getOverdueEMIs(req: Request, res: Response): Promise<void> {
    try {
      const borrowerId = req.query.borrowerId
        ? parseInt(req.query.borrowerId as string)
        : undefined;

      const overdueEMIs = await EMIModel.getOverdueEMIs(borrowerId);

      res.status(200).json({
        success: true,
        data: overdueEMIs,
      });
    } catch (error) {
      console.error('Get Overdue EMIs Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve overdue EMIs',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get upcoming EMIs (due in next N days)
   */
  static async getUpcomingEMIs(req: Request, res: Response): Promise<void> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const borrowerId = req.query.borrowerId
        ? parseInt(req.query.borrowerId as string)
        : undefined;

      const upcomingEMIs = await EMIModel.getUpcomingEMIs(days, borrowerId);

      res.status(200).json({
        success: true,
        data: upcomingEMIs,
      });
    } catch (error) {
      console.error('Get Upcoming EMIs Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve upcoming EMIs',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Process EMI payment
   */
  static async processEMIPayment(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = emiPaymentSchema.parse(req.body);

      const updatedEMI = await EMIModel.processPayment(
        validatedData.emiId,
        validatedData.paidAmount,
        validatedData.paymentDate ? new Date(validatedData.paymentDate) : new Date()
      );

      res.status(200).json({
        success: true,
        message: 'EMI payment processed successfully',
        data: updatedEMI,
      });
    } catch (error) {
      console.error('Process EMI Payment Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process EMI payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update overdue EMIs and calculate penalties
   */
  static async updateOverdueEMIs(req: Request, res: Response): Promise<void> {
    try {
      const updatedCount = await EMIModel.updateOverdueEMIs();

      res.status(200).json({
        success: true,
        message: `Updated ${updatedCount} overdue EMIs`,
        data: { updatedCount },
      });
    } catch (error) {
      console.error('Update Overdue EMIs Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update overdue EMIs',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get EMI statistics for a loan
   */
  static async getEMIStats(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const stats = await EMIModel.getLoanEMIStats(loanId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Get EMI Stats Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve EMI statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get EMI amortization chart data
   */
  static async getAmortizationChart(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const chartData = await EMIModel.getAmortizationData(loanId);

      res.status(200).json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('Get Amortization Chart Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve amortization chart data',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Recalculate EMI schedule after prepayment
   */
  static async recalculateAfterPrepayment(req: Request, res: Response): Promise<void> {
    try {
      const { loanId, prepaymentAmount, option } = req.body;

      if (!loanId || !prepaymentAmount) {
        res.status(400).json({
          success: false,
          message: 'Loan ID and prepayment amount are required',
        });
        return;
      }

      const newSchedule = await EMIScheduleService.recalculateScheduleAfterPrepayment(
        loanId,
        prepaymentAmount,
        option || 'REDUCE_TENURE'
      );

      res.status(200).json({
        success: true,
        message: 'EMI schedule recalculated successfully',
        data: newSchedule,
      });
    } catch (error) {
      console.error('Recalculate After Prepayment Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to recalculate EMI schedule',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get EMI dashboard summary
   */
  static async getDashboardSummary(req: Request, res: Response): Promise<void> {
    try {
      const borrowerId = req.query.borrowerId
        ? parseInt(req.query.borrowerId as string)
        : undefined;

      const summary = await EMIModel.getDashboardSummary(borrowerId);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error('Get Dashboard Summary Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard summary',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get EMI details by ID
   */
  static async getEMIById(req: Request, res: Response): Promise<void> {
    try {
      const emiId = parseInt(req.params.emiId);

      if (isNaN(emiId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid EMI ID',
        });
        return;
      }

      const emi = await EMIModel.findById(emiId);

      if (!emi) {
        res.status(404).json({
          success: false,
          message: 'EMI not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: emi,
      });
    } catch (error) {
      console.error('Get EMI By ID Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve EMI details',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Calculate penalty for an EMI
   */
  static async calculatePenalty(req: Request, res: Response): Promise<void> {
    try {
      const emiId = parseInt(req.params.emiId);
      const penaltyRate = req.body.penaltyRate || 2;

      if (isNaN(emiId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid EMI ID',
        });
        return;
      }

      const updatedEMI = await EMIModel.calculatePenalty(emiId, penaltyRate);

      res.status(200).json({
        success: true,
        message: 'Penalty calculated and updated successfully',
        data: updatedEMI,
      });
    } catch (error) {
      console.error('Calculate Penalty Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate penalty',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
