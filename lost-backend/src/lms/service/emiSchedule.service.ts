/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Loan, EMI, Prisma } from '@prisma/client';
import prisma from '../models/prisma';
import {
  EMICalculationService,
  EMICalculationInput,
  EMIScheduleItem,
} from './emiCalculation.service';
import moment from 'moment';
import NP from 'number-precision';

export interface GenerateEMIScheduleInput {
  loanId: number;
  startDate?: Date;
  regenerate?: boolean;
}

export interface EMIScheduleWithLoan extends EMI {
  loan: Loan;
}

export class EMIScheduleService {
  /**
   * Generate and save EMI schedule for a loan
   */
  static async generateEMISchedule(input: GenerateEMIScheduleInput): Promise<EMI[]> {
    const { loanId, startDate, regenerate = false } = input;

    // Get loan details
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    // Check if EMI schedule already exists
    const existingEMIs = await prisma.eMI.findMany({
      where: { loanId, isActive: true },
      orderBy: { emiNumber: 'asc' },
    });

    if (existingEMIs.length > 0 && !regenerate) {
      throw new Error(
        'EMI schedule already exists for this loan. Use regenerate option to recreate.'
      );
    }

    // If regenerating, deactivate existing EMIs
    if (regenerate && existingEMIs.length > 0) {
      await prisma.eMI.updateMany({
        where: { loanId, isActive: true },
        data: { isActive: false },
      });
    }

    // Calculate EMI schedule
    const calculationInput: EMICalculationInput = {
      principalAmount: EMICalculationService.decimalToNumber(loan.principalAmount),
      interestRate: EMICalculationService.decimalToNumber(loan.interestRate),
      tenure: loan.tenure,
      startDate: startDate || loan.disbursementDate || undefined,
    };

    const { schedule } = EMICalculationService.generateEMISchedule(calculationInput);

    // Create EMI records in database
    const emiData: Prisma.EMICreateManyInput[] = schedule.map((emi: EMIScheduleItem) => ({
      loanId,
      emiNumber: emi.emiNumber,
      dueDate: emi.dueDate,
      principalAmount: new Prisma.Decimal(emi.principalAmount),
      interestAmount: new Prisma.Decimal(emi.interestAmount),
      totalAmount: new Prisma.Decimal(emi.totalAmount),
      balanceAmount: new Prisma.Decimal(emi.totalAmount), // Initially, balance = total
      outstandingPrincipal: new Prisma.Decimal(emi.outstandingPrincipal),
      cumulativePrincipalPaid: new Prisma.Decimal(emi.cumulativePrincipalPaid),
      cumulativeInterestPaid: new Prisma.Decimal(emi.cumulativeInterestPaid),
      roundedPrincipalAmount: NP.round(emi.principalAmount, 0),
      roundedInterestAmount: NP.round(emi.interestAmount, 0),
      roundedTotalAmount: NP.round(emi.totalAmount, 0),
      roundedBalanceAmount: NP.round(emi.totalAmount, 0),
      roundedOutstandingPrincipal: NP.round(emi.outstandingPrincipal, 0),
      roundedCumulativePrincipalPaid: NP.round(emi.cumulativePrincipalPaid, 0),
      roundedCumulativeInterestPaid: NP.round(emi.cumulativeInterestPaid, 0),
      status: 'PENDING',
      isActive: true,
    }));

    // Batch insert EMI records
    await prisma.eMI.createMany({
      data: emiData,
    });

    // Update loan with calculated EMI amount and maturity date
    const lastEMI = schedule[schedule.length - 1];
    await prisma.loan.update({
      where: { id: loanId },
      data: {
        emiAmount: new Prisma.Decimal(schedule[0].totalAmount),
        maturityDate: lastEMI.dueDate,
        outstandingAmount: loan.principalAmount, // Initially outstanding = principal
      },
    });

    // Return created EMI records
    return await prisma.eMI.findMany({
      where: { loanId, isActive: true },
      orderBy: { emiNumber: 'asc' },
    });
  }

  /**
   * Get EMI schedule for a loan
   */
  static async getEMISchedule(loanId: number): Promise<EMI[]> {
    return await prisma.eMI.findMany({
      where: { loanId, isActive: true },
      orderBy: { emiNumber: 'asc' },
    });
  }

  /**
   * Get EMI schedule with loan details
   */
  static async getEMIScheduleWithLoan(loanId: number): Promise<EMIScheduleWithLoan[]> {
    return await prisma.eMI.findMany({
      where: { loanId, isActive: true },
      include: { loan: true },
      orderBy: { emiNumber: 'asc' },
    });
  }

  /**
   * Get pending EMIs for a loan
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
   * Get overdue EMIs across all loans or for a specific borrower
   */
  static async getOverdueEMIs(borrowerId?: number): Promise<EMIScheduleWithLoan[]> {
    const whereCondition: any = {
      isActive: true,
      dueDate: { lt: new Date() },
      status: { in: ['PENDING', 'PARTIAL_PAID'] },
    };

    if (borrowerId) {
      whereCondition.loan = { borrowerId };
    }

    return await prisma.eMI.findMany({
      where: whereCondition,
      include: { loan: true },
      orderBy: [{ dueDate: 'asc' }, { emiNumber: 'asc' }],
    });
  }

  /**
   * Update EMI status and calculate penalties for overdue EMIs
   */
  static async updateOverdueEMIs(): Promise<void> {
    const currentDate = new Date();

    // Find all overdue EMIs
    const overdueEMIs = await prisma.eMI.findMany({
      where: {
        isActive: true,
        dueDate: { lt: currentDate },
        status: 'PENDING',
      },
      include: { loan: true },
    });

    // Update each overdue EMI
    for (const emi of overdueEMIs) {
      const lateDays = moment(currentDate).diff(moment(emi.dueDate), 'days');
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
    }
  }

  /**
   * Recalculate EMI schedule after prepayment
   */
  static async recalculateScheduleAfterPrepayment(
    loanId: number,
    prepaymentAmount: number,
    option: 'REDUCE_TENURE' | 'REDUCE_EMI' = 'REDUCE_TENURE'
  ): Promise<EMI[]> {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    const currentOutstanding = EMICalculationService.decimalToNumber(
      loan.outstandingAmount || loan.principalAmount
    );
    const newPrincipal = currentOutstanding - prepaymentAmount;

    if (newPrincipal <= 0) {
      // Loan is fully paid, mark all pending EMIs as cancelled
      await prisma.eMI.updateMany({
        where: { loanId, status: 'PENDING' },
        data: { status: 'DEFAULTED', isActive: false }, // Using DEFAULTED as cancelled status
      });

      await prisma.loan.update({
        where: { id: loanId },
        data: {
          loanStatus: 'COMPLETED',
          outstandingAmount: new Prisma.Decimal(0),
        },
      });

      return [];
    }

    // Get remaining EMIs
    const remainingEMIs = await prisma.eMI.findMany({
      where: { loanId, status: 'PENDING', isActive: true },
      orderBy: { emiNumber: 'asc' },
    });

    const remainingTenure = remainingEMIs.length;
    const nextEMIDate = remainingEMIs[0]?.dueDate || new Date();

    // Recalculate schedule
    const newSchedule = EMICalculationService.recalculateSchedule(
      EMICalculationService.decimalToNumber(loan.principalAmount),
      newPrincipal,
      EMICalculationService.decimalToNumber(loan.interestRate),
      remainingTenure,
      nextEMIDate
    );

    // Deactivate old pending EMIs
    await prisma.eMI.updateMany({
      where: { loanId, status: 'PENDING' },
      data: { isActive: false },
    });

    // Create new EMI schedule
    const newEMIData: Prisma.EMICreateManyInput[] = newSchedule.schedule.map(
      (emi: EMIScheduleItem, index: number) => ({
        loanId,
        emiNumber: remainingEMIs[index]?.emiNumber || index + 1,
        dueDate: emi.dueDate,
        principalAmount: new Prisma.Decimal(emi.principalAmount),
        interestAmount: new Prisma.Decimal(emi.interestAmount),
        totalAmount: new Prisma.Decimal(emi.totalAmount),
        balanceAmount: new Prisma.Decimal(emi.totalAmount),
        outstandingPrincipal: new Prisma.Decimal(emi.outstandingPrincipal),
        cumulativePrincipalPaid: new Prisma.Decimal(emi.cumulativePrincipalPaid),
        cumulativeInterestPaid: new Prisma.Decimal(emi.cumulativeInterestPaid),
        roundedPrincipalAmount: Math.round(emi.principalAmount),
        roundedInterestAmount: Math.round(emi.interestAmount),
        roundedTotalAmount: Math.round(emi.totalAmount),
        roundedBalanceAmount: Math.round(emi.totalAmount),
        roundedOutstandingPrincipal: Math.round(emi.outstandingPrincipal),
        roundedCumulativePrincipalPaid: Math.round(emi.cumulativePrincipalPaid),
        roundedCumulativeInterestPaid: Math.round(emi.cumulativeInterestPaid),
        status: 'PENDING',
        isActive: true,
      })
    );

    await prisma.eMI.createMany({ data: newEMIData });

    // Update loan details
    await prisma.loan.update({
      where: { id: loanId },
      data: {
        outstandingAmount: new Prisma.Decimal(newPrincipal),
        emiAmount: new Prisma.Decimal(newSchedule.emiAmount),
        maturityDate: newSchedule.schedule[newSchedule.schedule.length - 1]?.dueDate,
      },
    });

    return await this.getEMISchedule(loanId);
  }

  /**
   * Calculate EMI summary for a loan
   */
  static async getEMISummary(loanId: number): Promise<{
    totalEMIs: number;
    paidEMIs: number;
    pendingEMIs: number;
    overdueEMIs: number;
    totalPrincipalPaid: number;
    totalInterestPaid: number;
    totalPenaltyPaid: number;
    remainingPrincipal: number;
    nextEMIDueDate?: Date;
    nextEMIAmount?: number;
  }> {
    const emis = await prisma.eMI.findMany({
      where: { loanId, isActive: true },
      orderBy: { emiNumber: 'asc' },
    });

    const paidEMIs = emis.filter(emi => emi.status === 'PAID');
    const pendingEMIs = emis.filter(emi => emi.status === 'PENDING');
    const overdueEMIs = emis.filter(emi => emi.status === 'OVERDUE');

    const totalPrincipalPaid = paidEMIs.reduce(
      (sum, emi) => sum + EMICalculationService.decimalToNumber(emi.principalAmount),
      0
    );
    const totalInterestPaid = paidEMIs.reduce(
      (sum, emi) => sum + EMICalculationService.decimalToNumber(emi.interestAmount),
      0
    );
    const totalPenaltyPaid = emis.reduce(
      (sum, emi) =>
        sum + EMICalculationService.decimalToNumber(emi.penaltyAmount || new Prisma.Decimal(0)),
      0
    );

    const nextPendingEMI = emis.find(emi => emi.status === 'PENDING' || emi.status === 'OVERDUE');
    const remainingPrincipal = nextPendingEMI
      ? EMICalculationService.decimalToNumber(nextPendingEMI.outstandingPrincipal)
      : 0;

    return {
      totalEMIs: emis.length,
      paidEMIs: paidEMIs.length,
      pendingEMIs: pendingEMIs.length,
      overdueEMIs: overdueEMIs.length,
      totalPrincipalPaid: Math.round(totalPrincipalPaid * 100) / 100,
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
      totalPenaltyPaid: Math.round(totalPenaltyPaid * 100) / 100,
      remainingPrincipal: Math.round(remainingPrincipal * 100) / 100,
      nextEMIDueDate: nextPendingEMI?.dueDate,
      nextEMIAmount: nextPendingEMI
        ? EMICalculationService.decimalToNumber(nextPendingEMI.totalAmount)
        : undefined,
    };
  }

  /**
   * Get EMI amortization chart data
   */
  static async getAmortizationChart(loanId: number): Promise<
    {
      emiNumber: number;
      principalAmount: number;
      interestAmount: number;
      cumulativePrincipal: number;
      cumulativeInterest: number;
      outstandingBalance: number;
    }[]
  > {
    const emis = await this.getEMISchedule(loanId);

    return emis.map(emi => ({
      emiNumber: emi.emiNumber,
      principalAmount: EMICalculationService.decimalToNumber(emi.principalAmount),
      interestAmount: EMICalculationService.decimalToNumber(emi.interestAmount),
      cumulativePrincipal: EMICalculationService.decimalToNumber(emi.cumulativePrincipalPaid),
      cumulativeInterest: EMICalculationService.decimalToNumber(emi.cumulativeInterestPaid),
      outstandingBalance: EMICalculationService.decimalToNumber(emi.outstandingPrincipal),
    }));
  }
}
