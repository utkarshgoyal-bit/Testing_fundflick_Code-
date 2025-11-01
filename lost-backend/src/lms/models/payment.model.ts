import {
  Payment,
  PaymentStatus,
  PaymentMethod,
  PaymentType,
  Loan,
  EMI,
  User,
  Prisma,
} from '@prisma/client';
import prisma from './prisma';
import {
  PaymentRecordingService,
  PaymentInput,
  PaymentResult,
} from '../service/paymentRecording.service';
import { EMICalculationService } from '../service/emiCalculation.service';

export interface PaymentWithRelations extends Payment {
  loan: Loan & { borrower: User };
  borrower: User;
  emi: EMI | null;
  reversalPayment: Payment | null;
  reversedPayments?: Payment[];
}

export interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  totalPenaltyPaid: number;
  lastPaymentDate?: Date;
  averagePaymentAmount: number;
}

export class PaymentModel {
  /**
   * Record a new payment
   */
  static async recordPayment(input: PaymentInput): Promise<PaymentResult> {
    return await PaymentRecordingService.recordPayment(input);
  }

  /**
   * Process bulk payment
   */
  static async processBulkPayment(
    input: PaymentInput & {
      targetEMIIds?: number[];
      payForMonths?: number;
    }
  ): Promise<PaymentResult> {
    return await PaymentRecordingService.processBulkPayment(input);
  }

  /**
   * Find payment by ID
   */
  static async findById(id: number): Promise<PaymentWithRelations | null> {
    const paymentById = await prisma.payment.findUnique({
      where: { id },
      include: {
        loan: {
          include: { borrower: true },
        },
        borrower: true,
        emi: true,
        reversalPayment: true,
        reversedPayments: true,
      },
    });
    return paymentById;
  }

  /**
   * Find payment by payment number
   */
  static async findByPaymentNumber(paymentNumber: string): Promise<PaymentWithRelations | null> {
    return await prisma.payment.findUnique({
      where: { paymentNumber },
      include: {
        loan: {
          include: { borrower: true },
        },
        borrower: true,
        emi: true,
        reversalPayment: true,
        reversedPayments: true,
      },
    });
  }

  /**
   * Get all payments with filtering
   */
  static async findAll(filters?: {
    loanId?: number;
    borrowerId?: number;
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    paymentType?: PaymentType;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  }): Promise<Payment[]> {
    const where: Prisma.PaymentWhereInput = {
      isActive: true,
    };

    if (filters?.loanId) where.loanId = filters.loanId;
    if (filters?.borrowerId) where.borrowerId = filters.borrowerId;
    if (filters?.status) where.status = filters.status;
    if (filters?.paymentMethod) where.paymentMethod = filters.paymentMethod;
    if (filters?.paymentType) where.paymentType = filters.paymentType;

    if (filters?.dateFrom || filters?.dateTo) {
      where.paymentDate = {};
      if (filters.dateFrom) where.paymentDate.gte = filters.dateFrom;
      if (filters.dateTo) where.paymentDate.lte = filters.dateTo;
    }

    return await prisma.payment.findMany({
      where,
      orderBy: { paymentDate: 'desc' },
      take: filters?.limit,
      skip: filters?.offset,
    });
  }

  /**
   * Get payment history for a loan
   */
  static async getPaymentHistory(
    loanId: number,
    limit?: number,
    offset?: number
  ): Promise<PaymentWithRelations[]> {
    return await prisma.payment.findMany({
      where: { loanId, isActive: true },
      include: {
        loan: {
          include: { borrower: true },
        },
        borrower: true,
        emi: true,
        reversalPayment: true,
        reversedPayments: true,
      },
      orderBy: { paymentDate: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get payments by borrower
   */
  static async getPaymentsByBorrower(
    borrowerId: number,
    limit?: number,
    offset?: number
  ): Promise<PaymentWithRelations[]> {
    return await prisma.payment.findMany({
      where: { borrowerId, isActive: true },
      include: {
        loan: {
          include: { borrower: true },
        },
        borrower: true,
        emi: true,
        reversalPayment: true,
        reversedPayments: true,
      },
      orderBy: { paymentDate: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Update payment status
   */
  static async updateStatus(
    id: number,
    status: PaymentStatus,
    remarks?: string,
    verifiedBy?: number
  ): Promise<Payment> {
    const updateData: Prisma.PaymentUpdateInput = {
      status,
      remarks,
    };

    if (status === 'VERIFIED') {
      updateData.verifiedBy = verifiedBy;
      updateData.verifiedAt = new Date();
    }

    return await prisma.payment.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Reverse a payment
   */
  static async reversePayment(
    paymentId: number,
    reversalReason: string,
    reversedBy: number
  ): Promise<Payment> {
    return await PaymentRecordingService.reversePayment(paymentId, reversalReason, reversedBy);
  }

  /**
   * Get payment summary for a loan
   */
  static async getPaymentSummary(loanId: number): Promise<PaymentSummary> {
    const payments = await prisma.payment.findMany({
      where: {
        loanId,
        isActive: true,
        status: { in: ['COMPLETED', 'VERIFIED'] },
        isReversal: false,
      },
    });

    if (payments.length === 0) {
      return {
        totalPayments: 0,
        totalAmount: 0,
        totalPrincipalPaid: 0,
        totalInterestPaid: 0,
        totalPenaltyPaid: 0,
        averagePaymentAmount: 0,
      };
    }

    const totalAmount = payments.reduce(
      (sum, payment) => sum + EMICalculationService.decimalToNumber(payment.amount),
      0
    );

    const totalPrincipalPaid = payments.reduce(
      (sum, payment) =>
        sum + EMICalculationService.decimalToNumber(payment.principalPaid || new Prisma.Decimal(0)),
      0
    );

    const totalInterestPaid = payments.reduce(
      (sum, payment) =>
        sum + EMICalculationService.decimalToNumber(payment.interestPaid || new Prisma.Decimal(0)),
      0
    );

    const totalPenaltyPaid = payments.reduce(
      (sum, payment) =>
        sum + EMICalculationService.decimalToNumber(payment.penaltyPaid || new Prisma.Decimal(0)),
      0
    );

    const lastPayment = payments.reduce((latest, payment) =>
      payment.paymentDate > latest.paymentDate ? payment : latest
    );

    return {
      totalPayments: payments.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalPrincipalPaid: Math.round(totalPrincipalPaid * 100) / 100,
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
      totalPenaltyPaid: Math.round(totalPenaltyPaid * 100) / 100,
      lastPaymentDate: lastPayment.paymentDate,
      averagePaymentAmount: Math.round((totalAmount / payments.length) * 100) / 100,
    };
  }

  /**
   * Get daily collection report
   */
  static async getDailyCollection(
    date: Date,
    borrowerId?: number
  ): Promise<{
    totalCollections: number;
    totalAmount: number;
    paymentBreakdown: {
      cash: number;
      online: number;
      cheque: number;
      others: number;
    };
    typeBreakdown: {
      emiPayments: number;
      penalties: number;
      prepayments: number;
      others: number;
    };
  }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const whereCondition: Prisma.PaymentWhereInput = {
      paymentDate: { gte: startOfDay, lte: endOfDay },
      status: { in: ['COMPLETED', 'VERIFIED'] },
      isActive: true,
      isReversal: false,
    };

    if (borrowerId) {
      whereCondition.borrowerId = borrowerId;
    }

    const payments = await prisma.payment.findMany({
      where: whereCondition,
    });

    const totalAmount = payments.reduce(
      (sum, payment) => sum + EMICalculationService.decimalToNumber(payment.amount),
      0
    );

    // Payment method breakdown
    const paymentBreakdown = {
      cash: payments
        .filter(p => p.paymentMethod === 'CASH')
        .reduce((sum, p) => sum + EMICalculationService.decimalToNumber(p.amount), 0),
      online: payments
        .filter(p => ['UPI', 'NEFT', 'RTGS', 'ONLINE'].includes(p.paymentMethod))
        .reduce((sum, p) => sum + EMICalculationService.decimalToNumber(p.amount), 0),
      cheque: payments
        .filter(p => p.paymentMethod === 'CHEQUE')
        .reduce((sum, p) => sum + EMICalculationService.decimalToNumber(p.amount), 0),
      others: payments
        .filter(p => ['BANK_TRANSFER', 'AUTO_DEBIT'].includes(p.paymentMethod))
        .reduce((sum, p) => sum + EMICalculationService.decimalToNumber(p.amount), 0),
    };

    // Payment type breakdown
    const typeBreakdown = {
      emiPayments: payments
        .filter(p => ['EMI_PAYMENT', 'BULK_PAYMENT'].includes(p.paymentType))
        .reduce((sum, p) => sum + EMICalculationService.decimalToNumber(p.amount), 0),
      penalties: payments
        .filter(p => p.paymentType === 'PENALTY_PAYMENT')
        .reduce((sum, p) => sum + EMICalculationService.decimalToNumber(p.amount), 0),
      prepayments: payments
        .filter(p => p.paymentType === 'PRINCIPAL_PREPAYMENT')
        .reduce((sum, p) => sum + EMICalculationService.decimalToNumber(p.amount), 0),
      others: payments
        .filter(
          p =>
            !['EMI_PAYMENT', 'BULK_PAYMENT', 'PENALTY_PAYMENT', 'PRINCIPAL_PREPAYMENT'].includes(
              p.paymentType
            )
        )
        .reduce((sum, p) => sum + EMICalculationService.decimalToNumber(p.amount), 0),
    };

    return {
      totalCollections: payments.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      paymentBreakdown: {
        cash: Math.round(paymentBreakdown.cash * 100) / 100,
        online: Math.round(paymentBreakdown.online * 100) / 100,
        cheque: Math.round(paymentBreakdown.cheque * 100) / 100,
        others: Math.round(paymentBreakdown.others * 100) / 100,
      },
      typeBreakdown: {
        emiPayments: Math.round(typeBreakdown.emiPayments * 100) / 100,
        penalties: Math.round(typeBreakdown.penalties * 100) / 100,
        prepayments: Math.round(typeBreakdown.prepayments * 100) / 100,
        others: Math.round(typeBreakdown.others * 100) / 100,
      },
    };
  }

  /**
   * Get monthly collection report
   */
  static async getMonthlyCollection(
    year: number,
    month: number,
    borrowerId?: number
  ): Promise<{
    totalAmount: number;
    totalPayments: number;
    dailyBreakdown: Array<{
      date: Date;
      amount: number;
      payments: number;
    }>;
  }> {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const whereCondition: Prisma.PaymentWhereInput = {
      paymentDate: { gte: startOfMonth, lte: endOfMonth },
      status: { in: ['COMPLETED', 'VERIFIED'] },
      isActive: true,
      isReversal: false,
    };

    if (borrowerId) {
      whereCondition.borrowerId = borrowerId;
    }

    const payments = await prisma.payment.findMany({
      where: whereCondition,
      orderBy: { paymentDate: 'asc' },
    });

    const totalAmount = payments.reduce(
      (sum, payment) => sum + EMICalculationService.decimalToNumber(payment.amount),
      0
    );

    // Group payments by date
    const dailyBreakdown = new Map<string, { amount: number; payments: number }>();

    payments.forEach(payment => {
      const dateKey = payment.paymentDate.toISOString().split('T')[0];
      const existing = dailyBreakdown.get(dateKey) || { amount: 0, payments: 0 };
      dailyBreakdown.set(dateKey, {
        amount: existing.amount + EMICalculationService.decimalToNumber(payment.amount),
        payments: existing.payments + 1,
      });
    });

    const dailyBreakdownArray = Array.from(dailyBreakdown.entries()).map(([dateStr, data]) => ({
      date: new Date(dateStr),
      amount: Math.round(data.amount * 100) / 100,
      payments: data.payments,
    }));

    return {
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalPayments: payments.length,
      dailyBreakdown: dailyBreakdownArray,
    };
  }

  /**
   * Get overdue payments
   */
  static async getOverduePayments(): Promise<PaymentWithRelations[]> {
    return await prisma.payment.findMany({
      where: {
        status: 'PENDING',
        paymentDate: { lt: new Date() },
        isActive: true,
      },
      include: {
        loan: {
          include: { borrower: true },
        },
        borrower: true,
        emi: true,
        reversalPayment: true,
        reversedPayments: true,
      },
      orderBy: { paymentDate: 'asc' },
    });
  }

  /**
   * Calculate payment breakdown for amount
   */
  static async calculatePaymentBreakdown(
    loanId: number,
    paymentAmount: number
  ): Promise<{
    totalPrincipal: number;
    totalInterest: number;
    totalPenalty: number;
    affectedEMIs: number;
    excessAmount: number;
    nextEMIDue?: Date;
  }> {
    return await PaymentRecordingService.calculatePaymentBreakdown(loanId, paymentAmount);
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStatistics(borrowerId?: number): Promise<{
    totalPayments: number;
    totalAmount: number;
    averagePaymentAmount: number;
    onTimePayments: number;
    latePayments: number;
    onTimePercentage: number;
    mostUsedPaymentMethod: PaymentMethod;
    totalReversals: number;
  }> {
    const whereCondition: Prisma.PaymentWhereInput = {
      isActive: true,
      status: { in: ['COMPLETED', 'VERIFIED'] },
    };

    if (borrowerId) {
      whereCondition.borrowerId = borrowerId;
    }

    const [payments, reversals] = await Promise.all([
      prisma.payment.findMany({
        where: { ...whereCondition, isReversal: false },
        include: { emi: true },
      }),
      prisma.payment.count({
        where: { ...whereCondition, isReversal: true },
      }),
    ]);

    const totalAmount = payments.reduce(
      (sum, payment) => sum + EMICalculationService.decimalToNumber(payment.amount),
      0
    );

    // Calculate on-time vs late payments
    const emiPayments = payments.filter(p => p.emi);
    const onTimePayments = emiPayments.filter(p => p.emi && p.paymentDate <= p.emi.dueDate).length;

    // Find most used payment method
    const methodCounts = payments.reduce(
      (acc, payment) => {
        acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
        return acc;
      },
      {} as Record<PaymentMethod, number>
    );

    const mostUsedPaymentMethod = Object.entries(methodCounts).reduce(
      (max, [method, count]) =>
        count > max.count ? { method: method as PaymentMethod, count } : max,
      { method: 'CASH' as PaymentMethod, count: 0 }
    ).method;

    return {
      totalPayments: payments.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      averagePaymentAmount:
        payments.length > 0 ? Math.round((totalAmount / payments.length) * 100) / 100 : 0,
      onTimePayments,
      latePayments: emiPayments.length - onTimePayments,
      onTimePercentage:
        emiPayments.length > 0 ? Math.round((onTimePayments / emiPayments.length) * 100) : 100,
      mostUsedPaymentMethod,
      totalReversals: reversals,
    };
  }

  /**
   * Soft delete payment
   */
  static async delete(id: number): Promise<Payment> {
    return await prisma.payment.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
