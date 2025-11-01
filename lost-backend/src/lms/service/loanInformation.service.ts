import { Loan, EMI, Payment, User, LoanStatus, EMIStatus, Prisma } from '@prisma/client';
import prisma from '../models/prisma';
import { EMICalculationService } from './emiCalculation.service';
import moment from 'moment';

export interface LoanDetailsResponse {
  loan: Loan;
  borrower: User;
  loanSummary: {
    totalLoanAmount: number;
    totalPaidAmount: number;
    outstandingAmount: number;
    totalInterestPaid: number;
    totalPenaltyPaid: number;
    completionPercentage: number;
    remainingTenure: number;
    nextEMIDueDate?: Date;
    nextEMIAmount?: number;
    daysUntilNextEMI?: number;
    isOverdue: boolean;
    overdueAmount: number;
    overdueDays: number;
  };
  emiSummary: {
    totalEMIs: number;
    paidEMIs: number;
    pendingEMIs: number;
    overdueEMIs: number;
    partialEMIs: number;
    avgEMIAmount: number;
    onTimePaymentPercentage: number;
  };
  recentPayments: Payment[];
  upcomingEMIs: EMI[];
}

export interface EMIScheduleResponse {
  loanId: number;
  loanNumber: string;
  borrowerName: string;
  schedule: Array<{
    emiId: number;
    emiNumber: number;
    dueDate: Date;
    principalAmount: number;
    interestAmount: number;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    penaltyAmount: number;
    status: EMIStatus;
    paidDate?: Date;
    lateDays: number;
    outstandingPrincipal: number;
    cumulativePrincipalPaid: number;
    cumulativeInterestPaid: number;
    payments: Array<{
      paymentId: number;
      paymentNumber: string;
      amount: number;
      paymentDate: Date;
      paymentMethod: string;
      status: string;
    }>;
  }>;
  summary: {
    totalScheduledAmount: number;
    totalPaidAmount: number;
    totalPendingAmount: number;
    totalPenalty: number;
    completionPercentage: number;
  };
}

export interface RepaymentStatusResponse {
  loanId: number;
  loanStatus: LoanStatus;
  overallHealth: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  repaymentMetrics: {
    onTimePayments: number;
    latePayments: number;
    missedPayments: number;
    totalPayments: number;
    onTimePercentage: number;
    avgDelayDays: number;
    currentStreak: number; // consecutive on-time payments
    longestStreak: number;
  };
  currentStatus: {
    isOverdue: boolean;
    overdueAmount: number;
    overdueDays: number;
    nextDueAmount: number;
    nextDueDate?: Date;
    daysUntilDue: number;
    gracePeriodsUsed: number;
  };
  financialMetrics: {
    totalDisbursed: number;
    totalRepaid: number;
    remainingBalance: number;
    interestPaidToDate: number;
    penaltiesPaid: number;
    prepaymentsMade: number;
    effectiveInterestRate: number;
  };
  projections: {
    expectedCompletionDate: Date;
    totalInterestProjected: number;
    monthsRemaining: number;
    potentialSavings?: number; // if prepayment made
  };
}

export interface UserDashboardResponse {
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  loansSummary: {
    totalLoans: number;
    activeLoans: number;
    completedLoans: number;
    totalBorrowed: number;
    totalOutstanding: number;
    totalPaid: number;
    avgCreditScore?: number;
  };
  paymentsSummary: {
    totalPayments: number;
    onTimePayments: number;
    latePayments: number;
    onTimePercentage: number;
    lastPaymentDate?: Date;
    nextPaymentDate?: Date;
    nextPaymentAmount?: number;
  };
  alerts: Array<{
    type: 'OVERDUE' | 'DUE_SOON' | 'GRACE_PERIOD' | 'SUCCESS' | 'WARNING';
    message: string;
    loanId?: number;
    dueDate?: Date;
    amount?: number;
  }>;
  recentActivity: Array<{
    type: 'PAYMENT' | 'EMI_DUE' | 'PENALTY' | 'LOAN_UPDATE';
    description: string;
    date: Date;
    amount?: number;
    loanId?: number;
  }>;
}

export class LoanInformationService {
  /**
   * Get comprehensive loan details for a user
   */
  static async getLoanDetails(loanId: number, userId?: number): Promise<LoanDetailsResponse> {
    const loan = await prisma.loan.findFirst({
      where: {
        id: loanId,
        ...(userId && { borrowerId: userId }),
        isActive: true,
      },
      include: {
        borrower: true,
        emis: {
          where: { isActive: true },
          orderBy: { emiNumber: 'asc' },
        },
        payments: {
          where: { isActive: true, status: { in: ['COMPLETED', 'VERIFIED'] } },
          orderBy: { paymentDate: 'desc' },
          take: 10, // Last 10 payments
        },
      },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    // Calculate loan summary
    const totalLoanAmount = EMICalculationService.decimalToNumber(loan.principalAmount);
    const outstandingAmount = EMICalculationService.decimalToNumber(
      loan.outstandingAmount || new Prisma.Decimal(0)
    );
    const totalPaidAmount = totalLoanAmount - outstandingAmount;

    const totalInterestPaid = loan.payments.reduce(
      (sum, payment) =>
        sum + EMICalculationService.decimalToNumber(payment.interestPaid || new Prisma.Decimal(0)),
      0
    );

    const totalPenaltyPaid = loan.payments.reduce(
      (sum, payment) =>
        sum + EMICalculationService.decimalToNumber(payment.penaltyPaid || new Prisma.Decimal(0)),
      0
    );

    const completionPercentage =
      totalLoanAmount > 0 ? Math.round((totalPaidAmount / totalLoanAmount) * 100) : 0;

    // Find next pending EMI
    const nextEMI = loan.emis.find(
      emi => emi.status === 'PENDING' || emi.status === 'PARTIAL_PAID' || emi.status === 'OVERDUE'
    );
    const nextEMIDueDate = nextEMI?.dueDate;
    const nextEMIAmount = nextEMI
      ? EMICalculationService.decimalToNumber(nextEMI.totalAmount)
      : undefined;
    const daysUntilNextEMI = nextEMIDueDate
      ? moment(nextEMIDueDate).diff(moment(), 'days')
      : undefined;

    // Check overdue status
    const overdueEMIs = loan.emis.filter(
      emi =>
        emi.status === 'OVERDUE' ||
        (emi.status === 'PENDING' && moment(emi.dueDate).isBefore(moment(), 'day'))
    );
    const isOverdue = overdueEMIs.length > 0;
    const overdueAmount = overdueEMIs.reduce(
      (sum, emi) =>
        sum + EMICalculationService.decimalToNumber(emi.balanceAmount || emi.totalAmount),
      0
    );
    const overdueDays =
      isOverdue && nextEMI ? Math.max(0, moment().diff(moment(nextEMI.dueDate), 'days')) : 0;

    const remainingTenure = loan.emis.filter(
      emi => emi.status === 'PENDING' || emi.status === 'PARTIAL_PAID'
    ).length;

    // EMI summary
    const totalEMIs = loan.emis.length;
    const paidEMIs = loan.emis.filter(emi => emi.status === 'PAID').length;
    const pendingEMIs = loan.emis.filter(emi => emi.status === 'PENDING').length;
    const overdueEMIsCount = loan.emis.filter(emi => emi.status === 'OVERDUE').length;
    const partialEMIs = loan.emis.filter(emi => emi.status === 'PARTIAL_PAID').length;

    const avgEMIAmount =
      loan.emis.length > 0
        ? loan.emis.reduce(
            (sum, emi) => sum + EMICalculationService.decimalToNumber(emi.totalAmount),
            0
          ) / loan.emis.length
        : 0;

    // Calculate on-time payment percentage
    const emiPayments = loan.payments.filter(payment => payment.emiId);
    const onTimePayments = emiPayments.filter(payment => {
      const relatedEMI = loan.emis.find(emi => emi.id === payment.emiId);
      return (
        relatedEMI && moment(payment.paymentDate).isSameOrBefore(moment(relatedEMI.dueDate), 'day')
      );
    }).length;
    const onTimePaymentPercentage =
      emiPayments.length > 0 ? Math.round((onTimePayments / emiPayments.length) * 100) : 100;

    // Get upcoming EMIs (next 3)
    const upcomingEMIs = loan.emis
      .filter(emi => emi.status === 'PENDING' || emi.status === 'PARTIAL_PAID')
      .slice(0, 3);

    return {
      loan,
      borrower: loan.borrower,
      loanSummary: {
        totalLoanAmount,
        totalPaidAmount,
        outstandingAmount,
        totalInterestPaid,
        totalPenaltyPaid,
        completionPercentage,
        remainingTenure,
        nextEMIDueDate,
        nextEMIAmount,
        daysUntilNextEMI,
        isOverdue,
        overdueAmount,
        overdueDays,
      },
      emiSummary: {
        totalEMIs,
        paidEMIs,
        pendingEMIs,
        overdueEMIs: overdueEMIsCount,
        partialEMIs,
        avgEMIAmount: Math.round(avgEMIAmount),
        onTimePaymentPercentage,
      },
      recentPayments: loan.payments,
      upcomingEMIs,
    };
  }

  /**
   * Get detailed EMI schedule with payment history
   */
  static async getEMIScheduleWithPayments(
    loanId: number,
    userId?: number
  ): Promise<EMIScheduleResponse> {
    const loan = await prisma.loan.findFirst({
      where: {
        id: loanId,
        ...(userId && { borrowerId: userId }),
        isActive: true,
      },
      include: {
        borrower: true,
        emis: {
          where: { isActive: true },
          include: {
            payments: {
              where: { isActive: true },
              orderBy: { paymentDate: 'desc' },
            },
          },
          orderBy: { emiNumber: 'asc' },
        },
      },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    const schedule = loan.emis.map(emi => ({
      emiId: emi.id,
      emiNumber: emi.emiNumber,
      dueDate: emi.dueDate,
      principalAmount: EMICalculationService.decimalToNumber(emi.principalAmount),
      interestAmount: EMICalculationService.decimalToNumber(emi.interestAmount),
      totalAmount: EMICalculationService.decimalToNumber(emi.totalAmount),
      paidAmount: EMICalculationService.decimalToNumber(emi.paidAmount || new Prisma.Decimal(0)),
      balanceAmount: EMICalculationService.decimalToNumber(emi.balanceAmount || emi.totalAmount),
      penaltyAmount: EMICalculationService.decimalToNumber(
        emi.penaltyAmount || new Prisma.Decimal(0)
      ),
      status: emi.status,
      paidDate: emi.paidDate || undefined,
      lateDays: emi.lateDays || 0,
      outstandingPrincipal: EMICalculationService.decimalToNumber(emi.outstandingPrincipal),
      cumulativePrincipalPaid: EMICalculationService.decimalToNumber(emi.cumulativePrincipalPaid),
      cumulativeInterestPaid: EMICalculationService.decimalToNumber(emi.cumulativeInterestPaid),
      payments: emi.payments.map(payment => ({
        paymentId: payment.id,
        paymentNumber: payment.paymentNumber,
        amount: EMICalculationService.decimalToNumber(payment.amount),
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
      })),
    }));

    const totalScheduledAmount = schedule.reduce(
      (sum, emi) => sum + emi.totalAmount + emi.penaltyAmount,
      0
    );
    const totalPaidAmount = schedule.reduce((sum, emi) => sum + emi.paidAmount, 0);
    const totalPendingAmount = totalScheduledAmount - totalPaidAmount;
    const totalPenalty = schedule.reduce((sum, emi) => sum + emi.penaltyAmount, 0);
    const completionPercentage =
      totalScheduledAmount > 0 ? Math.round((totalPaidAmount / totalScheduledAmount) * 100) : 0;

    return {
      loanId: loan.id,
      loanNumber: loan.loanNumber,
      borrowerName: loan.borrower.name || 'Unknown',
      schedule,
      summary: {
        totalScheduledAmount,
        totalPaidAmount,
        totalPendingAmount,
        totalPenalty,
        completionPercentage,
      },
    };
  }

  /**
   * Get comprehensive repayment status
   */
  static async getRepaymentStatus(
    loanId: number,
    userId?: number
  ): Promise<RepaymentStatusResponse> {
    const loan = await prisma.loan.findFirst({
      where: {
        id: loanId,
        ...(userId && { borrowerId: userId }),
        isActive: true,
      },
      include: {
        emis: {
          where: { isActive: true },
          orderBy: { emiNumber: 'asc' },
        },
        payments: {
          where: {
            isActive: true,
            status: { in: ['COMPLETED', 'VERIFIED'] },
            emiId: { not: null },
          },
          include: { emi: true },
          orderBy: { paymentDate: 'asc' },
        },
      },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    // Calculate repayment metrics
    const emiPayments = loan.payments.filter(p => p.emi);
    const onTimePayments = emiPayments.filter(
      payment =>
        payment.emi &&
        moment(payment.paymentDate).isSameOrBefore(moment(payment.emi.dueDate), 'day')
    );
    const latePayments = emiPayments.filter(
      payment =>
        payment.emi && moment(payment.paymentDate).isAfter(moment(payment.emi.dueDate), 'day')
    );

    // const totalEMIs = loan.emis.length;
    // const paidEMIs = loan.emis.filter(emi => emi.status === 'PAID').length;
    const missedPayments = loan.emis.filter(
      emi => emi.status === 'OVERDUE' && moment(emi.dueDate).isBefore(moment().subtract(30, 'days'))
    ).length;

    const onTimePercentage =
      emiPayments.length > 0 ? Math.round((onTimePayments.length / emiPayments.length) * 100) : 100;

    const avgDelayDays =
      latePayments.length > 0
        ? latePayments.reduce((sum, payment) => {
            const delayDays = payment.emi
              ? moment(payment.paymentDate).diff(moment(payment.emi.dueDate), 'days')
              : 0;
            return sum + delayDays;
          }, 0) / latePayments.length
        : 0;

    // Calculate current and longest streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const sortedPayments = emiPayments.sort((a, b) =>
      moment(a.paymentDate).diff(moment(b.paymentDate))
    );

    for (let i = sortedPayments.length - 1; i >= 0; i--) {
      const payment = sortedPayments[i];
      const isOnTime =
        payment.emi &&
        moment(payment.paymentDate).isSameOrBefore(moment(payment.emi.dueDate), 'day');

      if (isOnTime) {
        if (i === sortedPayments.length - 1) currentStreak++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (i === sortedPayments.length - 1) currentStreak = 0;
        tempStreak = 0;
      }
    }

    // Current status
    const overdueEMIs = loan.emis.filter(emi => emi.status === 'OVERDUE');
    const isOverdue = overdueEMIs.length > 0;
    const overdueAmount = overdueEMIs.reduce(
      (sum, emi) =>
        sum + EMICalculationService.decimalToNumber(emi.balanceAmount || emi.totalAmount),
      0
    );

    const nextPendingEMI = loan.emis.find(
      emi => emi.status === 'PENDING' || emi.status === 'PARTIAL_PAID'
    );
    const overdueDays =
      isOverdue && nextPendingEMI
        ? Math.max(0, moment().diff(moment(nextPendingEMI.dueDate), 'days'))
        : 0;

    const nextDueAmount = nextPendingEMI
      ? EMICalculationService.decimalToNumber(nextPendingEMI.totalAmount)
      : 0;
    const nextDueDate = nextPendingEMI?.dueDate;
    const daysUntilDue = nextDueDate ? moment(nextDueDate).diff(moment(), 'days') : 0;

    // Financial metrics
    const totalDisbursed = EMICalculationService.decimalToNumber(loan.principalAmount);
    const remainingBalance = EMICalculationService.decimalToNumber(
      loan.outstandingAmount || new Prisma.Decimal(0)
    );
    const totalRepaid = totalDisbursed - remainingBalance;

    const interestPaidToDate = loan.payments.reduce(
      (sum, payment) =>
        sum + EMICalculationService.decimalToNumber(payment.interestPaid || new Prisma.Decimal(0)),
      0
    );

    const penaltiesPaid = loan.payments.reduce(
      (sum, payment) =>
        sum + EMICalculationService.decimalToNumber(payment.penaltyPaid || new Prisma.Decimal(0)),
      0
    );

    const prepaymentsMade = loan.payments
      .filter(p => p.paymentType === 'PRINCIPAL_PREPAYMENT')
      .reduce((sum, payment) => sum + EMICalculationService.decimalToNumber(payment.amount), 0);

    const totalInterestProjected = loan.emis.reduce(
      (sum, emi) => sum + EMICalculationService.decimalToNumber(emi.interestAmount),
      0
    );

    const effectiveInterestRate =
      totalDisbursed > 0 ? (totalInterestProjected / totalDisbursed) * 100 : 0;

    // Projections
    const remainingEMIs = loan.emis.filter(emi => emi.status !== 'PAID').length;
    const expectedCompletionDate = nextPendingEMI
      ? moment(nextPendingEMI.dueDate)
          .add(remainingEMIs - 1, 'months')
          .toDate()
      : new Date();

    // Determine overall health
    let overallHealth: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL' = 'GOOD';

    if (onTimePercentage >= 95 && !isOverdue) {
      overallHealth = 'EXCELLENT';
    } else if (onTimePercentage >= 85 && overdueDays <= 7) {
      overallHealth = 'GOOD';
    } else if (onTimePercentage >= 70 && overdueDays <= 30) {
      overallHealth = 'FAIR';
    } else if (onTimePercentage >= 50 && overdueDays <= 90) {
      overallHealth = 'POOR';
    } else {
      overallHealth = 'CRITICAL';
    }

    return {
      loanId: loan.id,
      loanStatus: loan.loanStatus,
      overallHealth,
      repaymentMetrics: {
        onTimePayments: onTimePayments.length,
        latePayments: latePayments.length,
        missedPayments,
        totalPayments: emiPayments.length,
        onTimePercentage,
        avgDelayDays: Math.round(avgDelayDays),
        currentStreak,
        longestStreak,
      },
      currentStatus: {
        isOverdue,
        overdueAmount,
        overdueDays,
        nextDueAmount,
        nextDueDate,
        daysUntilDue,
        gracePeriodsUsed: 0, // Can be implemented based on business rules
      },
      financialMetrics: {
        totalDisbursed,
        totalRepaid,
        remainingBalance,
        interestPaidToDate,
        penaltiesPaid,
        prepaymentsMade,
        effectiveInterestRate: Math.round(effectiveInterestRate * 100) / 100,
      },
      projections: {
        expectedCompletionDate,
        totalInterestProjected,
        monthsRemaining: remainingEMIs,
      },
    };
  }

  /**
   * Get user dashboard with all loan information
   */
  static async getUserDashboard(userId: number): Promise<UserDashboardResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        loans: {
          where: { isActive: true },
          include: {
            emis: {
              where: { isActive: true },
              orderBy: { dueDate: 'asc' },
            },
            payments: {
              where: { isActive: true, status: { in: ['COMPLETED', 'VERIFIED'] } },
              orderBy: { paymentDate: 'desc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Loans summary
    const totalLoans = user.loans.length;
    const activeLoans = user.loans.filter(loan => loan.loanStatus === 'ACTIVE').length;
    const completedLoans = user.loans.filter(loan => loan.loanStatus === 'COMPLETED').length;

    const totalBorrowed = user.loans.reduce(
      (sum, loan) => sum + EMICalculationService.decimalToNumber(loan.principalAmount),
      0
    );

    const totalOutstanding = user.loans.reduce(
      (sum, loan) =>
        sum +
        EMICalculationService.decimalToNumber(loan.outstandingAmount || new Prisma.Decimal(0)),
      0
    );

    const totalPaid = totalBorrowed - totalOutstanding;

    // Payments summary
    const allPayments = user.loans.flatMap(loan => loan.payments);
    const emiPayments = allPayments.filter(payment => payment.emiId);

    const onTimePayments = emiPayments.filter(payment => {
      const relatedEMI = user.loans
        .flatMap(loan => loan.emis)
        .find(emi => emi.id === payment.emiId);
      return (
        relatedEMI && moment(payment.paymentDate).isSameOrBefore(moment(relatedEMI.dueDate), 'day')
      );
    }).length;

    const latePayments = emiPayments.length - onTimePayments;
    const onTimePercentage =
      emiPayments.length > 0 ? Math.round((onTimePayments / emiPayments.length) * 100) : 100;

    const lastPayment = allPayments.sort((a, b) =>
      moment(b.paymentDate).diff(moment(a.paymentDate))
    )[0];
    const lastPaymentDate = lastPayment?.paymentDate;

    // Find next payment due
    const allPendingEMIs = user.loans
      .flatMap(loan =>
        loan.emis.filter(emi => emi.status === 'PENDING' || emi.status === 'PARTIAL_PAID')
      )
      .sort((a, b) => moment(a.dueDate).diff(moment(b.dueDate)));

    const nextEMI = allPendingEMIs[0];
    const nextPaymentDate = nextEMI?.dueDate;
    const nextPaymentAmount = nextEMI
      ? EMICalculationService.decimalToNumber(nextEMI.totalAmount)
      : undefined;

    // Generate alerts
    const alerts: UserDashboardResponse['alerts'] = [];

    // Check for overdue EMIs
    const overdueEMIs = user.loans.flatMap(loan =>
      loan.emis.filter(emi => emi.status === 'OVERDUE')
    );

    overdueEMIs.forEach(emi => {
      const overdueDays = moment().diff(moment(emi.dueDate), 'days');
      alerts.push({
        type: 'OVERDUE',
        message: `EMI ${emi.emiNumber} is overdue by ${overdueDays} days`,
        loanId: emi.loanId,
        dueDate: emi.dueDate,
        amount: EMICalculationService.decimalToNumber(emi.totalAmount),
      });
    });

    // Check for EMIs due soon
    const dueSoonEMIs = allPendingEMIs.filter(emi => {
      const daysUntilDue = moment(emi.dueDate).diff(moment(), 'days');
      return daysUntilDue >= 0 && daysUntilDue <= 7;
    });

    dueSoonEMIs.forEach(emi => {
      const daysUntilDue = moment(emi.dueDate).diff(moment(), 'days');
      alerts.push({
        type: 'DUE_SOON',
        message: `EMI ${emi.emiNumber} is due in ${daysUntilDue} days`,
        loanId: emi.loanId,
        dueDate: emi.dueDate,
        amount: EMICalculationService.decimalToNumber(emi.totalAmount),
      });
    });

    // Recent activity
    const recentActivity: UserDashboardResponse['recentActivity'] = [];

    // Recent payments
    allPayments.slice(0, 5).forEach(payment => {
      recentActivity.push({
        type: 'PAYMENT',
        description: `Payment of ₹${EMICalculationService.decimalToNumber(payment.amount).toLocaleString()} received`,
        date: payment.paymentDate,
        amount: EMICalculationService.decimalToNumber(payment.amount),
        loanId: payment.loanId,
      });
    });

    // Recent EMI dues
    const recentEMIs = allPendingEMIs.slice(0, 3);
    recentEMIs.forEach(emi => {
      recentActivity.push({
        type: 'EMI_DUE',
        description: `EMI ${emi.emiNumber} due on ${moment(emi.dueDate).format('DD MMM YYYY')}`,
        date: emi.dueDate,
        amount: EMICalculationService.decimalToNumber(emi.totalAmount),
        loanId: emi.loanId,
      });
    });

    // Sort recent activity by date
    recentActivity.sort((a, b) => moment(b.date).diff(moment(a.date)));

    return {
      user: {
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        phoneNumber: user.phoneNumber || undefined,
      },
      loansSummary: {
        totalLoans,
        activeLoans,
        completedLoans,
        totalBorrowed,
        totalOutstanding,
        totalPaid,
        avgCreditScore: user.cibilScore || undefined,
      },
      paymentsSummary: {
        totalPayments: allPayments.length,
        onTimePayments,
        latePayments,
        onTimePercentage,
        lastPaymentDate,
        nextPaymentDate,
        nextPaymentAmount,
      },
      alerts: alerts.slice(0, 10), // Limit to 10 most important alerts
      recentActivity: recentActivity.slice(0, 10), // Limit to 10 most recent activities
    };
  }

  /**
   * Get loans summary for a user
   */
  static async getUserLoans(userId: number): Promise<
    Array<{
      loanId: number;
      loanNumber: string;
      loanType: string;
      principalAmount: number;
      outstandingAmount: number;
      emiAmount: number;
      loanStatus: LoanStatus;
      nextEMIDueDate?: Date;
      isOverdue: boolean;
      completionPercentage: number;
    }>
  > {
    const loans = await prisma.loan.findMany({
      where: { borrowerId: userId, isActive: true },
      include: {
        emis: {
          where: { isActive: true },
          orderBy: { emiNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return loans.map(loan => {
      const principalAmount = EMICalculationService.decimalToNumber(loan.principalAmount);
      const outstandingAmount = EMICalculationService.decimalToNumber(
        loan.outstandingAmount || new Prisma.Decimal(0)
      );
      const completionPercentage =
        principalAmount > 0
          ? Math.round(((principalAmount - outstandingAmount) / principalAmount) * 100)
          : 0;

      const nextPendingEMI = loan.emis.find(
        emi => emi.status === 'PENDING' || emi.status === 'PARTIAL_PAID' || emi.status === 'OVERDUE'
      );
      const isOverdue = loan.emis.some(emi => emi.status === 'OVERDUE');

      return {
        loanId: loan.id,
        loanNumber: loan.loanNumber,
        loanType: loan.loanType,
        principalAmount,
        outstandingAmount,
        emiAmount: EMICalculationService.decimalToNumber(loan.emiAmount),
        loanStatus: loan.loanStatus,
        nextEMIDueDate: nextPendingEMI?.dueDate,
        isOverdue,
        completionPercentage,
      };
    });
  }
}
