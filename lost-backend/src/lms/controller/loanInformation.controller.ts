/* eslint-disable no-console */
import { Request, Response } from 'express';
import { LoanInformationService } from '../service/loanInformation.service';

export class LoanInformationController {
  /**
   * Get comprehensive loan details
   */
  static async getLoanDetails(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const loanDetails = await LoanInformationService.getLoanDetails(loanId, userId);

      res.status(200).json({
        success: true,
        data: loanDetails,
      });
    } catch (error) {
      console.error('Get Loan Details Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve loan details',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get EMI schedule with payment history
   */
  static async getEMIScheduleWithPayments(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const emiSchedule = await LoanInformationService.getEMIScheduleWithPayments(loanId, userId);

      res.status(200).json({
        success: true,
        data: emiSchedule,
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
   * Get repayment status and analytics
   */
  static async getRepaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const repaymentStatus = await LoanInformationService.getRepaymentStatus(loanId, userId);

      res.status(200).json({
        success: true,
        data: repaymentStatus,
      });
    } catch (error) {
      console.error('Get Repayment Status Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve repayment status',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get user dashboard with all loan information
   */
  static async getUserDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
        return;
      }

      const dashboard = await LoanInformationService.getUserDashboard(userId);

      res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      console.error('Get User Dashboard Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user dashboard',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get user loans summary
   */
  static async getUserLoans(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
        return;
      }

      const loans = await LoanInformationService.getUserLoans(userId);

      res.status(200).json({
        success: true,
        data: loans,
      });
    } catch (error) {
      console.error('Get User Loans Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user loans',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get loan overview (basic information)
   */
  static async getLoanOverview(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const loanDetails = await LoanInformationService.getLoanDetails(loanId, userId);

      // Return simplified overview
      const overview = {
        loan: {
          id: loanDetails.loan.id,
          loanNumber: loanDetails.loan.loanNumber,
          loanType: loanDetails.loan.loanType,
          loanStatus: loanDetails.loan.loanStatus,
          applicationDate: loanDetails.loan.applicationDate,
          disbursementDate: loanDetails.loan.disbursementDate,
          maturityDate: loanDetails.loan.maturityDate,
        },
        borrower: {
          id: loanDetails.borrower.id,
          name: loanDetails.borrower.name,
          email: loanDetails.borrower.email,
          phoneNumber: loanDetails.borrower.phoneNumber,
        },
        summary: loanDetails.loanSummary,
        emiSummary: loanDetails.emiSummary,
        nextPayment: {
          dueDate: loanDetails.loanSummary.nextEMIDueDate,
          amount: loanDetails.loanSummary.nextEMIAmount,
          daysUntilDue: loanDetails.loanSummary.daysUntilNextEMI,
        },
      };

      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error) {
      console.error('Get Loan Overview Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve loan overview',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get loan payment summary
   */
  static async getLoanPaymentSummary(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const loanDetails = await LoanInformationService.getLoanDetails(loanId, userId);

      const paymentSummary = {
        loanId: loanDetails.loan.id,
        loanNumber: loanDetails.loan.loanNumber,
        totalAmount: loanDetails.loanSummary.totalLoanAmount,
        paidAmount: loanDetails.loanSummary.totalPaidAmount,
        outstandingAmount: loanDetails.loanSummary.outstandingAmount,
        completionPercentage: loanDetails.loanSummary.completionPercentage,
        interestPaid: loanDetails.loanSummary.totalInterestPaid,
        penaltyPaid: loanDetails.loanSummary.totalPenaltyPaid,
        remainingEMIs: loanDetails.loanSummary.remainingTenure,
        nextEMI: {
          dueDate: loanDetails.loanSummary.nextEMIDueDate,
          amount: loanDetails.loanSummary.nextEMIAmount,
          isOverdue: loanDetails.loanSummary.isOverdue,
          overdueDays: loanDetails.loanSummary.overdueDays,
        },
        recentPayments: loanDetails.recentPayments.slice(0, 5).map(payment => ({
          paymentNumber: payment.paymentNumber,
          amount: payment.amount,
          paymentDate: payment.paymentDate,
          paymentMethod: payment.paymentMethod,
          status: payment.status,
        })),
      };

      res.status(200).json({
        success: true,
        data: paymentSummary,
      });
    } catch (error) {
      console.error('Get Loan Payment Summary Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve loan payment summary',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get user payment history
   */
  static async getUserPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
        return;
      }

      const dashboard = await LoanInformationService.getUserDashboard(userId);

      // Get detailed payment history from all loans
      const allPayments = dashboard.recentActivity
        .filter(activity => activity.type === 'PAYMENT')
        .slice(offset, offset + limit);

      const paymentHistory = {
        userId: dashboard.user.id,
        userName: dashboard.user.name,
        totalPayments: dashboard.paymentsSummary.totalPayments,
        onTimePercentage: dashboard.paymentsSummary.onTimePercentage,
        lastPaymentDate: dashboard.paymentsSummary.lastPaymentDate,
        payments: allPayments,
      };

      res.status(200).json({
        success: true,
        data: paymentHistory,
      });
    } catch (error) {
      console.error('Get User Payment History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user payment history',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get user alerts and notifications
   */
  static async getUserAlerts(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
        return;
      }

      const dashboard = await LoanInformationService.getUserDashboard(userId);

      const alerts = {
        userId: dashboard.user.id,
        totalAlerts: dashboard.alerts.length,
        alerts: dashboard.alerts.map(alert => ({
          ...alert,
          priority:
            alert.type === 'OVERDUE' ? 'HIGH' : alert.type === 'DUE_SOON' ? 'MEDIUM' : 'LOW',
        })),
        summary: {
          overdue: dashboard.alerts.filter(a => a.type === 'OVERDUE').length,
          dueSoon: dashboard.alerts.filter(a => a.type === 'DUE_SOON').length,
          warnings: dashboard.alerts.filter(a => a.type === 'WARNING').length,
          success: dashboard.alerts.filter(a => a.type === 'SUCCESS').length,
        },
      };

      res.status(200).json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      console.error('Get User Alerts Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user alerts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get loan analytics for charts and graphs
   */
  static async getLoanAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const loanId = parseInt(req.params.loanId);
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

      if (isNaN(loanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const [loanDetails, emiSchedule, repaymentStatus] = await Promise.all([
        LoanInformationService.getLoanDetails(loanId, userId),
        LoanInformationService.getEMIScheduleWithPayments(loanId, userId),
        LoanInformationService.getRepaymentStatus(loanId, userId),
      ]);

      const analytics = {
        loanId,
        loanNumber: loanDetails.loan.loanNumber,

        // Payment progress chart data
        paymentProgress: {
          totalAmount: loanDetails.loanSummary.totalLoanAmount,
          paidAmount: loanDetails.loanSummary.totalPaidAmount,
          remainingAmount: loanDetails.loanSummary.outstandingAmount,
          completionPercentage: loanDetails.loanSummary.completionPercentage,
        },

        // EMI status distribution
        emiDistribution: {
          total: loanDetails.emiSummary.totalEMIs,
          paid: loanDetails.emiSummary.paidEMIs,
          pending: loanDetails.emiSummary.pendingEMIs,
          overdue: loanDetails.emiSummary.overdueEMIs,
          partial: loanDetails.emiSummary.partialEMIs,
        },

        // Monthly payment trend
        monthlyTrend: emiSchedule.schedule.map(emi => ({
          month: emi.emiNumber,
          principal: emi.principalAmount,
          interest: emi.interestAmount,
          totalPaid: emi.paidAmount,
          status: emi.status,
          cumulativePrincipal: emi.cumulativePrincipalPaid,
          outstandingBalance: emi.outstandingPrincipal,
        })),

        // Payment performance metrics
        performance: {
          onTimePercentage: repaymentStatus.repaymentMetrics.onTimePercentage,
          avgDelayDays: repaymentStatus.repaymentMetrics.avgDelayDays,
          currentStreak: repaymentStatus.repaymentMetrics.currentStreak,
          overallHealth: repaymentStatus.overallHealth,
        },

        // Financial breakdown
        financialBreakdown: {
          principalPaid:
            repaymentStatus.financialMetrics.totalRepaid -
            repaymentStatus.financialMetrics.interestPaidToDate,
          interestPaid: repaymentStatus.financialMetrics.interestPaidToDate,
          penaltiesPaid: repaymentStatus.financialMetrics.penaltiesPaid,
          prepaymentsMade: repaymentStatus.financialMetrics.prepaymentsMade,
        },
      };

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error('Get Loan Analytics Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve loan analytics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
