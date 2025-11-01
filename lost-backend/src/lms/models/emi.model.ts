import { EMI, EMIStatus, Loan, Payment, Prisma } from '@prisma/client';
import prisma from './prisma';
import { EMICalculationService } from '../service/emiCalculation.service';

export interface EMIWithRelations extends EMI {
  loan: Loan;
  payments: Payment[];
}

export class EMIModel {
  /**
   * Find EMI by ID
   */
  static async findById(id: number): Promise<EMIWithRelations | null> {
    return await prisma.eMI.findUnique({
      where: { id },
      include: {
        loan: true,
        payments: {
          where: { isActive: true },
          orderBy: { paymentDate: 'desc' },
        },
      },
    });
  }

  /**
   * Find EMIs by loan ID
   */
  static async findByLoanId(loanId: number): Promise<EMI[]> {
    return await prisma.eMI.findMany({
      where: { loanId, isActive: true },
      orderBy: { emiNumber: 'asc' },
    });
  }

  /**
   * Find EMI by loan ID and EMI number
   */
  static async findByLoanAndEMINumber(
    loanId: number,
    emiNumber: number
  ): Promise<EMIWithRelations | null> {
    return await prisma.eMI.findFirst({
      where: { loanId, emiNumber, isActive: true },
      include: {
        loan: true,
        payments: {
          where: { isActive: true },
          orderBy: { paymentDate: 'desc' },
        },
      },
    });
  }

  /**
   * Get all pending EMIs for a loan
   */
  static async getPendingEMIs(loanId: number): Promise<EMI[]> {
    return await prisma.eMI.findMany({
      where: {
        loanId,
        isActive: true,
        status: { in: ['PENDING', 'PARTIAL_PAID', 'OVERDUE'] },
      },
      orderBy: { emiNumber: 'asc' },
    });
  }

  /**
   * Get all overdue EMIs
   */
  static async getOverdueEMIs(borrowerId?: number): Promise<EMIWithRelations[]> {
    const whereCondition: Prisma.EMIWhereInput = {
      isActive: true,
      dueDate: { lt: new Date() },
      status: { in: ['PENDING', 'PARTIAL_PAID'] },
    };

    if (borrowerId) {
      whereCondition.loan = { borrowerId };
    }

    return await prisma.eMI.findMany({
      where: whereCondition,
      include: {
        loan: true,
        payments: {
          where: { isActive: true },
          orderBy: { paymentDate: 'desc' },
        },
      },
      orderBy: [{ dueDate: 'asc' }, { emiNumber: 'asc' }],
    });
  }

  /**
   * Get EMIs due in next N days
   */
  static async getUpcomingEMIs(days: number = 7, borrowerId?: number): Promise<EMIWithRelations[]> {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const whereCondition: Prisma.EMIWhereInput = {
      isActive: true,
      dueDate: {
        gte: new Date(),
        lte: endDate,
      },
      status: 'PENDING',
    };

    if (borrowerId) {
      whereCondition.loan = { borrowerId };
    }

    return await prisma.eMI.findMany({
      where: whereCondition,
      include: {
        loan: true,
        payments: {
          where: { isActive: true },
          orderBy: { paymentDate: 'desc' },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * Update EMI status
   */
  static async updateStatus(id: number, status: EMIStatus, paidDate?: Date): Promise<EMI> {
    const updateData: Prisma.EMIUpdateInput = { status };

    if (status === 'PAID' && paidDate) {
      updateData.paidDate = paidDate;
      updateData.paidAmount = { set: undefined }; // Will be set by payment processing
      updateData.balanceAmount = new Prisma.Decimal(0);
    }

    return await prisma.eMI.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Process EMI payment
   */
  static async processPayment(
    emiId: number,
    paidAmount: number,
    paymentDate: Date = new Date()
  ): Promise<EMI> {
    const emi = await this.findById(emiId);
    if (!emi) {
      throw new Error('EMI not found');
    }

    const totalAmount = EMICalculationService.decimalToNumber(emi.totalAmount);
    const currentPaidAmount = EMICalculationService.decimalToNumber(
      emi.paidAmount || new Prisma.Decimal(0)
    );
    const newPaidAmount = currentPaidAmount + paidAmount;
    const balanceAmount = Math.max(0, totalAmount - newPaidAmount);

    // Determine new status
    let newStatus: EMIStatus;
    if (balanceAmount <= 0) {
      newStatus = 'PAID';
    } else if (newPaidAmount > 0) {
      newStatus = 'PARTIAL_PAID';
    } else {
      newStatus = emi.status; // Keep existing status
    }

    return await prisma.eMI.update({
      where: { id: emiId },
      data: {
        paidAmount: new Prisma.Decimal(newPaidAmount),
        balanceAmount: new Prisma.Decimal(balanceAmount),
        status: newStatus,
        paidDate: newStatus === 'PAID' ? paymentDate : emi.paidDate,
      },
    });
  }

  /**
   * Calculate and update penalty for overdue EMI
   */
  static async calculatePenalty(id: number, penaltyRate: number = 2): Promise<EMI> {
    const emi = await this.findById(id);
    if (!emi) {
      throw new Error('EMI not found');
    }

    const penalty = EMICalculationService.calculatePenalty(
      EMICalculationService.decimalToNumber(emi.totalAmount),
      emi.dueDate,
      penaltyRate
    );

    const lateDays = Math.max(
      0,
      Math.ceil((new Date().getTime() - emi.dueDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    return await prisma.eMI.update({
      where: { id },
      data: {
        penaltyAmount: new Prisma.Decimal(penalty),
        lateDays,
      },
    });
  }

  /**
   * Bulk update overdue EMIs
   */
  static async updateOverdueEMIs(): Promise<number> {
    const currentDate = new Date();

    // Find all EMIs that are overdue but not marked as such
    const overdueEMIs = await prisma.eMI.findMany({
      where: {
        isActive: true,
        dueDate: { lt: currentDate },
        status: 'PENDING',
      },
    });

    let updatedCount = 0;

    for (const emi of overdueEMIs) {
      const lateDays = Math.ceil(
        (currentDate.getTime() - emi.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const penalty = EMICalculationService.calculatePenalty(
        EMICalculationService.decimalToNumber(emi.totalAmount),
        emi.dueDate,
        2, // 2% penalty rate
        currentDate
      );

      await prisma.eMI.update({
        where: { id: emi.id },
        data: {
          status: 'OVERDUE',
          lateDays,
          penaltyAmount: new Prisma.Decimal(penalty),
        },
      });

      updatedCount++;
    }

    return updatedCount;
  }

  /**
   * Get EMI payment history
   */
  static async getPaymentHistory(emiId: number): Promise<Payment[]> {
    return await prisma.payment.findMany({
      where: { emiId, isActive: true },
      orderBy: { paymentDate: 'desc' },
    });
  }

  /**
   * Get EMI statistics for a loan
   */
  static async getLoanEMIStats(loanId: number): Promise<{
    totalEMIs: number;
    paidEMIs: number;
    pendingEMIs: number;
    overdueEMIs: number;
    partialPaidEMIs: number;
    totalAmountDue: number;
    totalAmountPaid: number;
    totalPenalty: number;
    nextDueDate?: Date;
  }> {
    const emis = await this.findByLoanId(loanId);

    const paidEMIs = emis.filter(emi => emi.status === 'PAID');
    const pendingEMIs = emis.filter(emi => emi.status === 'PENDING');
    const overdueEMIs = emis.filter(emi => emi.status === 'OVERDUE');
    const partialPaidEMIs = emis.filter(emi => emi.status === 'PARTIAL_PAID');

    const totalAmountDue = emis.reduce(
      (sum, emi) => sum + EMICalculationService.decimalToNumber(emi.totalAmount),
      0
    );

    const totalAmountPaid = emis.reduce(
      (sum, emi) =>
        sum + EMICalculationService.decimalToNumber(emi.paidAmount || new Prisma.Decimal(0)),
      0
    );

    const totalPenalty = emis.reduce(
      (sum, emi) =>
        sum + EMICalculationService.decimalToNumber(emi.penaltyAmount || new Prisma.Decimal(0)),
      0
    );

    // Find next pending EMI due date
    const nextPendingEMI = emis.find(
      emi => emi.status === 'PENDING' || emi.status === 'OVERDUE' || emi.status === 'PARTIAL_PAID'
    );

    return {
      totalEMIs: emis.length,
      paidEMIs: paidEMIs.length,
      pendingEMIs: pendingEMIs.length,
      overdueEMIs: overdueEMIs.length,
      partialPaidEMIs: partialPaidEMIs.length,
      totalAmountDue: Math.round(totalAmountDue * 100) / 100,
      totalAmountPaid: Math.round(totalAmountPaid * 100) / 100,
      totalPenalty: Math.round(totalPenalty * 100) / 100,
      nextDueDate: nextPendingEMI?.dueDate,
    };
  }

  /**
   * Get EMIs by status
   */
  static async findByStatus(status: EMIStatus, limit?: number): Promise<EMIWithRelations[]> {
    return await prisma.eMI.findMany({
      where: { status, isActive: true },
      include: {
        loan: {
          include: {
            borrower: true,
          },
        },
        payments: {
          where: { isActive: true },
          orderBy: { paymentDate: 'desc' },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: limit,
    });
  }

  /**
   * Get EMI amortization data for charts
   */
  static async getAmortizationData(loanId: number): Promise<
    {
      emiNumber: number;
      principalAmount: number;
      interestAmount: number;
      cumulativePrincipal: number;
      cumulativeInterest: number;
      outstandingBalance: number;
      status: EMIStatus;
      dueDate: Date;
    }[]
  > {
    const emis = await this.findByLoanId(loanId);

    return emis.map(emi => ({
      emiNumber: emi.emiNumber,
      principalAmount: EMICalculationService.decimalToNumber(emi.principalAmount),
      interestAmount: EMICalculationService.decimalToNumber(emi.interestAmount),
      cumulativePrincipal: EMICalculationService.decimalToNumber(emi.cumulativePrincipalPaid),
      cumulativeInterest: EMICalculationService.decimalToNumber(emi.cumulativeInterestPaid),
      outstandingBalance: EMICalculationService.decimalToNumber(emi.outstandingPrincipal),
      status: emi.status,
      dueDate: emi.dueDate,
    }));
  }

  /**
   * Soft delete EMI
   */
  static async delete(id: number): Promise<EMI> {
    return await prisma.eMI.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Get EMI dashboard summary
   */
  static async getDashboardSummary(borrowerId?: number): Promise<{
    totalDueToday: number;
    totalOverdue: number;
    upcomingInWeek: number;
    totalPenalty: number;
    collectionEfficiency: number;
  }> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    const whereCondition: Prisma.EMIWhereInput = { isActive: true };
    if (borrowerId) {
      whereCondition.loan = { borrowerId };
    }

    const [dueToday, overdue, upcomingWeek, penaltyStats, collectionStats] = await Promise.all([
      prisma.eMI.count({
        where: {
          ...whereCondition,
          dueDate: { gte: startOfDay, lte: endOfDay },
          status: { in: ['PENDING', 'PARTIAL_PAID'] },
        },
      }),
      prisma.eMI.count({
        where: {
          ...whereCondition,
          dueDate: { lt: startOfDay },
          status: { in: ['PENDING', 'PARTIAL_PAID', 'OVERDUE'] },
        },
      }),
      prisma.eMI.count({
        where: {
          ...whereCondition,
          dueDate: { gte: today, lte: oneWeekLater },
          status: 'PENDING',
        },
      }),
      prisma.eMI.aggregate({
        where: {
          ...whereCondition,
          penaltyAmount: { gt: 0 },
        },
        _sum: { penaltyAmount: true },
      }),
      prisma.eMI.aggregate({
        where: whereCondition,
        _count: { _all: true },
        _sum: { paidAmount: true, totalAmount: true },
      }),
    ]);

    const totalPenalty = EMICalculationService.decimalToNumber(
      penaltyStats._sum.penaltyAmount || new Prisma.Decimal(0)
    );
    const totalPaid = EMICalculationService.decimalToNumber(
      collectionStats._sum.paidAmount || new Prisma.Decimal(0)
    );
    const totalDue = EMICalculationService.decimalToNumber(
      collectionStats._sum.totalAmount || new Prisma.Decimal(0)
    );
    const collectionEfficiency = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;

    return {
      totalDueToday: dueToday,
      totalOverdue: overdue,
      upcomingInWeek: upcomingWeek,
      totalPenalty: Math.round(totalPenalty * 100) / 100,
      collectionEfficiency: Math.round(collectionEfficiency * 100) / 100,
    };
  }
}
