/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import { PaymentModel } from '../models/payment.model';
import { PaymentInput } from '../service/paymentRecording.service';
import { z } from 'zod';

// Validation schemas
const recordPaymentSchema = z.object({
  loanId: z.number().positive(),
  borrowerId: z.number().positive(),
  amount: z.number().positive(),
  paymentMethod: z.enum([
    'CASH',
    'CHEQUE',
    'BANK_TRANSFER',
    'UPI',
    'NEFT',
    'RTGS',
    'ONLINE',
    'AUTO_DEBIT',
  ]),
  paymentType: z
    .enum([
      'EMI_PAYMENT',
      'PRINCIPAL_PREPAYMENT',
      'PROCESSING_FEE',
      'PENALTY_PAYMENT',
      'BULK_PAYMENT',
      'ADVANCE_PAYMENT',
      'EXCESS_ADJUSTMENT',
      'REVERSAL',
      'CLOSURE_PAYMENT',
      'OTHER',
    ])
    .optional(),
  paymentDate: z.string().datetime().optional(),
  transactionId: z.string().optional(),
  bankName: z.string().optional(),
  chequeNumber: z.string().optional(),
  chequeDate: z.string().datetime().optional(),
  remarks: z.string().optional(),
  processedBy: z.number().positive().optional(),
  specificEMIId: z.number().positive().optional(),
});

const bulkPaymentSchema = recordPaymentSchema.extend({
  targetEMIIds: z.array(z.number().positive()).optional(),
  payForMonths: z.number().positive().max(60).optional(),
});

const reversePaymentSchema = z.object({
  paymentId: z.number().positive(),
  reversalReason: z.string().min(10, 'Reversal reason must be at least 10 characters'),
  reversedBy: z.number().positive(),
});

const updatePaymentStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'REFUNDED',
    'REVERSED',
    'VERIFIED',
  ]),
  remarks: z.string().optional(),
  verifiedBy: z.number().positive().optional(),
});

export class PaymentController {
  /**
   * Record a new payment
   */
  static async recordPayment(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = recordPaymentSchema.parse(req.body);

      const paymentInput: PaymentInput = {
        loanId: validatedData.loanId,
        borrowerId: validatedData.borrowerId,
        amount: validatedData.amount,
        paymentMethod: validatedData.paymentMethod,
        paymentType: validatedData.paymentType,
        paymentDate: validatedData.paymentDate ? new Date(validatedData.paymentDate) : undefined,
        transactionId: validatedData.transactionId,
        bankName: validatedData.bankName,
        chequeNumber: validatedData.chequeNumber,
        chequeDate: validatedData.chequeDate ? new Date(validatedData.chequeDate) : undefined,
        remarks: validatedData.remarks,
        processedBy: validatedData.processedBy,
        specificEMIId: validatedData.specificEMIId,
      };

      const result = await PaymentModel.recordPayment(paymentInput);

      res.status(201).json({
        success: true,
        message: 'Payment recorded successfully',
        data: {
          payment: result.payment,
          allocations: result.allocations,
          updatedLoan: {
            id: result.updatedLoan.id,
            outstandingAmount: result.updatedLoan.outstandingAmount,
            loanStatus: result.updatedLoan.loanStatus,
          },
          summary: {
            totalPrincipalPaid: result.totalPrincipalPaid,
            totalInterestPaid: result.totalInterestPaid,
            totalPenaltyPaid: result.totalPenaltyPaid,
            excessAmount: result.excessAmount,
            updatedEMIs: result.updatedEMIs.length,
          },
        },
      });
    } catch (error) {
      console.error('Record Payment Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Process bulk payment (multiple EMIs)
   */
  static async processBulkPayment(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = bulkPaymentSchema.parse(req.body);

      const paymentInput = {
        loanId: validatedData.loanId,
        borrowerId: validatedData.borrowerId,
        amount: validatedData.amount,
        paymentMethod: validatedData.paymentMethod,
        paymentType: validatedData.paymentType || 'BULK_PAYMENT',
        paymentDate: validatedData.paymentDate ? new Date(validatedData.paymentDate) : undefined,
        transactionId: validatedData.transactionId,
        bankName: validatedData.bankName,
        chequeNumber: validatedData.chequeNumber,
        chequeDate: validatedData.chequeDate ? new Date(validatedData.chequeDate) : undefined,
        remarks: validatedData.remarks,
        processedBy: validatedData.processedBy,
        targetEMIIds: validatedData.targetEMIIds,
        payForMonths: validatedData.payForMonths,
      };

      const result = await PaymentModel.processBulkPayment(paymentInput);

      res.status(201).json({
        success: true,
        message: 'Bulk payment processed successfully',
        data: {
          payment: result.payment,
          allocations: result.allocations,
          summary: {
            totalPrincipalPaid: result.totalPrincipalPaid,
            totalInterestPaid: result.totalInterestPaid,
            totalPenaltyPaid: result.totalPenaltyPaid,
            excessAmount: result.excessAmount,
            updatedEMIs: result.updatedEMIs.length,
          },
        },
      });
    } catch (error) {
      console.error('Process Bulk Payment Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process bulk payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Calculate payment breakdown before actual payment
   */
  static async calculatePaymentBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const { loanId, amount } = req.body;

      if (!loanId || !amount) {
        res.status(400).json({
          success: false,
          message: 'Loan ID and amount are required',
        });
        return;
      }

      const breakdown = await PaymentModel.calculatePaymentBreakdown(loanId, amount);

      res.status(200).json({
        success: true,
        data: breakdown,
      });
    } catch (error) {
      console.error('Calculate Payment Breakdown Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate payment breakdown',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(req: Request, res: Response): Promise<void> {
    try {
      const paymentId = parseInt(req.params.paymentId);

      if (isNaN(paymentId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid payment ID',
        });
        return;
      }

      const payment = await PaymentModel.findById(paymentId);

      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error('Get Payment By ID Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get payment by payment number
   */
  static async getPaymentByNumber(req: Request, res: Response): Promise<void> {
    try {
      const paymentNumber = req.params.paymentNumber;

      const payment = await PaymentModel.findByPaymentNumber(paymentNumber);

      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error('Get Payment By Number Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get payment history for a loan
   */
  static async getPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const [payments, summary] = await Promise.all([
        PaymentModel.getPaymentHistory(loanId, limit, offset),
        PaymentModel.getPaymentSummary(loanId),
      ]);

      res.status(200).json({
        success: true,
        data: {
          payments,
          summary,
        },
      });
    } catch (error) {
      console.error('Get Payment History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment history',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get payments by borrower
   */
  static async getPaymentsByBorrower(req: Request, res: Response): Promise<void> {
    try {
      const borrowerId = parseInt(req.params.borrowerId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

      if (isNaN(borrowerId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid borrower ID',
        });
        return;
      }

      const payments = await PaymentModel.getPaymentsByBorrower(borrowerId, limit, offset);

      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      console.error('Get Payments By Borrower Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve payments',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const paymentId = parseInt(req.params.paymentId);
      const validatedData = updatePaymentStatusSchema.parse(req.body);

      if (isNaN(paymentId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid payment ID',
        });
        return;
      }

      const updatedPayment = await PaymentModel.updateStatus(
        paymentId,
        validatedData.status,
        validatedData.remarks,
        validatedData.verifiedBy
      );

      res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        data: updatedPayment,
      });
    } catch (error) {
      console.error('Update Payment Status Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update payment status',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Reverse a payment
   */
  static async reversePayment(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = reversePaymentSchema.parse(req.body);

      const reversalPayment = await PaymentModel.reversePayment(
        validatedData.paymentId,
        validatedData.reversalReason,
        validatedData.reversedBy
      );

      res.status(200).json({
        success: true,
        message: 'Payment reversed successfully',
        data: reversalPayment,
      });
    } catch (error) {
      console.error('Reverse Payment Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reverse payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get daily collection report
   */
  static async getDailyCollection(req: Request, res: Response): Promise<void> {
    try {
      const dateStr = req.query.date as string;
      const borrowerId = req.query.borrowerId
        ? parseInt(req.query.borrowerId as string)
        : undefined;

      if (!dateStr) {
        res.status(400).json({
          success: false,
          message: 'Date parameter is required',
        });
        return;
      }

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Invalid date format',
        });
        return;
      }

      const report = await PaymentModel.getDailyCollection(date, borrowerId);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('Get Daily Collection Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve daily collection report',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get monthly collection report
   */
  static async getMonthlyCollection(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.query.year as string);
      const month = parseInt(req.query.month as string);
      const borrowerId = req.query.borrowerId
        ? parseInt(req.query.borrowerId as string)
        : undefined;

      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        res.status(400).json({
          success: false,
          message: 'Valid year and month parameters are required',
        });
        return;
      }

      const report = await PaymentModel.getMonthlyCollection(year, month, borrowerId);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('Get Monthly Collection Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve monthly collection report',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStatistics(req: Request, res: Response): Promise<void> {
    try {
      const borrowerId = req.query.borrowerId
        ? parseInt(req.query.borrowerId as string)
        : undefined;

      const statistics = await PaymentModel.getPaymentStatistics(borrowerId);

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      console.error('Get Payment Statistics Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get all payments with filtering
   */
  static async getAllPayments(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        loanId: req.query.loanId ? parseInt(req.query.loanId as string) : undefined,
        borrowerId: req.query.borrowerId ? parseInt(req.query.borrowerId as string) : undefined,
        status: req.query.status as any,
        paymentMethod: req.query.paymentMethod as any,
        paymentType: req.query.paymentType as any,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const payments = await PaymentModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      console.error('Get All Payments Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve payments',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get overdue payments
   */
  static async getOverduePayments(req: Request, res: Response): Promise<void> {
    try {
      const overduePayments = await PaymentModel.getOverduePayments();

      res.status(200).json({
        success: true,
        data: overduePayments,
      });
    } catch (error) {
      console.error('Get Overdue Payments Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve overdue payments',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
