import { Payment, EMI, Loan, PaymentMethod, PaymentType, Prisma } from '@prisma/client';
import prisma from '../models/prisma';
import { EMICalculationService } from './emiCalculation.service';

export interface PaymentInput {
  loanId: number;
  borrowerId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType?: PaymentType;
  paymentDate?: Date;
  transactionId?: string;
  bankName?: string;
  chequeNumber?: string;
  chequeDate?: Date;
  remarks?: string;
  processedBy?: number;
  specificEMIId?: number; // For specific EMI payment
}

export interface PaymentAllocation {
  emiId: number;
  emiNumber: number;
  principalPaid: number;
  interestPaid: number;
  penaltyPaid: number;
  totalAllocated: number;
  remainingEMIBalance: number;
}

export interface PaymentResult {
  payment: Payment;
  allocations: PaymentAllocation[];
  updatedEMIs: EMI[];
  updatedLoan: Loan;
  excessAmount: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  totalPenaltyPaid: number;
}

export class PaymentRecordingService {
  /**
   * Record a payment and update balances
   */
  static async recordPayment(input: PaymentInput): Promise<PaymentResult> {
    return await prisma.$transaction(async tx => {
      // Get loan with current outstanding balance
      const loan = await tx.loan.findUnique({
        where: { id: input.loanId },
        include: {
          emis: {
            where: { isActive: true },
            orderBy: { emiNumber: 'asc' },
          },
        },
      });

      if (!loan) {
        throw new Error('Loan not found');
      }

      if (loan.borrowerId !== input.borrowerId) {
        throw new Error('Borrower ID does not match loan borrower');
      }

      const currentOutstanding = EMICalculationService.decimalToNumber(
        loan.outstandingAmount || new Prisma.Decimal(0)
      );

      if (currentOutstanding <= 0) {
        throw new Error('Loan is already fully paid');
      }

      // Generate payment number
      const paymentNumber = await this.generatePaymentNumber();

      // Determine payment allocation strategy
      const allocationResult = input.specificEMIId
        ? await this.allocateToSpecificEMI(input.specificEMIId, input.amount, tx)
        : await this.allocatePaymentToEMIs(input.loanId, input.amount, tx);

      // Create payment record
      const paymentData: Prisma.PaymentCreateInput = {
        paymentNumber,
        amount: new Prisma.Decimal(input.amount),
        paymentMethod: input.paymentMethod,
        paymentType: input.paymentType || 'EMI_PAYMENT',
        paymentDate: input.paymentDate || new Date(),
        transactionId: input.transactionId,
        bankName: input.bankName,
        chequeNumber: input.chequeNumber,
        chequeDate: input.chequeDate,
        remarks: input.remarks,
        processedBy: input.processedBy,
        outstandingBeforePayment: new Prisma.Decimal(currentOutstanding),
        outstandingAfterPayment: new Prisma.Decimal(Math.max(0, currentOutstanding - input.amount)),
        principalPaid: new Prisma.Decimal(allocationResult.totalPrincipalPaid),
        interestPaid: new Prisma.Decimal(allocationResult.totalInterestPaid),
        penaltyPaid: new Prisma.Decimal(allocationResult.totalPenaltyPaid),
        excessAmount: new Prisma.Decimal(allocationResult.excessAmount),
        allocatedEMIs: allocationResult.allocations as unknown as Prisma.InputJsonValue,
        status: 'COMPLETED',
        loan: { connect: { id: input.loanId } },
        borrower: { connect: { id: input.borrowerId } },
        emi: input.specificEMIId ? { connect: { id: input.specificEMIId } } : undefined,
      };

      const payment = await tx.payment.create({ data: paymentData });

      // Update EMIs based on allocation
      const updatedEMIs = await this.updateEMIsFromAllocation(allocationResult.allocations, tx);

      // Update loan outstanding balance
      const newOutstanding = Math.max(0, currentOutstanding - input.amount);
      const updatedLoan = await tx.loan.update({
        where: { id: input.loanId },
        data: {
          outstandingAmount: new Prisma.Decimal(newOutstanding),
          totalPaidAmount: {
            increment: new Prisma.Decimal(input.amount - allocationResult.excessAmount),
          },
          loanStatus: newOutstanding <= 0 ? 'COMPLETED' : loan.loanStatus,
        },
      });

      return {
        payment,
        allocations: allocationResult.allocations,
        updatedEMIs,
        updatedLoan,
        excessAmount: allocationResult.excessAmount,
        totalPrincipalPaid: allocationResult.totalPrincipalPaid,
        totalInterestPaid: allocationResult.totalInterestPaid,
        totalPenaltyPaid: allocationResult.totalPenaltyPaid,
      };
    });
  }

  /**
   * Allocate payment to EMIs in order of due date
   */
  private static async allocatePaymentToEMIs(
    loanId: number,
    paymentAmount: number,
    tx: Prisma.TransactionClient
  ): Promise<{
    allocations: PaymentAllocation[];
    totalPrincipalPaid: number;
    totalInterestPaid: number;
    totalPenaltyPaid: number;
    excessAmount: number;
  }> {
    // Get pending EMIs in order of due date
    const pendingEMIs = await tx.eMI.findMany({
      where: {
        loanId,
        isActive: true,
        status: { in: ['PENDING', 'PARTIAL_PAID', 'OVERDUE'] },
      },
      orderBy: [
        { status: 'desc' }, // Overdue first
        { dueDate: 'asc' },
        { emiNumber: 'asc' },
      ],
    });

    let remainingAmount = paymentAmount;
    const allocations: PaymentAllocation[] = [];
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    let totalPenaltyPaid = 0;

    for (const emi of pendingEMIs) {
      if (remainingAmount <= 0) break;

      const currentPaid = EMICalculationService.decimalToNumber(
        emi.paidAmount || new Prisma.Decimal(0)
      );
      const totalEMI = EMICalculationService.decimalToNumber(emi.totalAmount);
      const penalty = EMICalculationService.decimalToNumber(
        emi.penaltyAmount || new Prisma.Decimal(0)
      );
      const totalDue = totalEMI + penalty - currentPaid;

      if (totalDue <= 0) continue;

      const allocationAmount = Math.min(remainingAmount, totalDue);
      const allocation = this.allocateAmountToEMIComponents(emi, allocationAmount, currentPaid);

      allocations.push({
        emiId: emi.id,
        emiNumber: emi.emiNumber,
        principalPaid: allocation.principalPaid,
        interestPaid: allocation.interestPaid,
        penaltyPaid: allocation.penaltyPaid,
        totalAllocated: allocationAmount,
        remainingEMIBalance: totalDue - allocationAmount,
      });

      totalPrincipalPaid += allocation.principalPaid;
      totalInterestPaid += allocation.interestPaid;
      totalPenaltyPaid += allocation.penaltyPaid;
      remainingAmount -= allocationAmount;
    }

    return {
      allocations,
      totalPrincipalPaid,
      totalInterestPaid,
      totalPenaltyPaid,
      excessAmount: remainingAmount,
    };
  }

  /**
   * Allocate payment to a specific EMI
   */
  private static async allocateToSpecificEMI(
    emiId: number,
    paymentAmount: number,
    tx: Prisma.TransactionClient
  ): Promise<{
    allocations: PaymentAllocation[];
    totalPrincipalPaid: number;
    totalInterestPaid: number;
    totalPenaltyPaid: number;
    excessAmount: number;
  }> {
    const emi = await tx.eMI.findUnique({ where: { id: emiId } });
    if (!emi) {
      throw new Error('EMI not found');
    }

    const currentPaid = EMICalculationService.decimalToNumber(
      emi.paidAmount || new Prisma.Decimal(0)
    );
    const totalEMI = EMICalculationService.decimalToNumber(emi.totalAmount);
    const penalty = EMICalculationService.decimalToNumber(
      emi.penaltyAmount || new Prisma.Decimal(0)
    );
    const totalDue = totalEMI + penalty - currentPaid;

    const allocationAmount = Math.min(paymentAmount, Math.max(0, totalDue));
    const allocation = this.allocateAmountToEMIComponents(emi, allocationAmount, currentPaid);

    return {
      allocations: [
        {
          emiId: emi.id,
          emiNumber: emi.emiNumber,
          principalPaid: allocation.principalPaid,
          interestPaid: allocation.interestPaid,
          penaltyPaid: allocation.penaltyPaid,
          totalAllocated: allocationAmount,
          remainingEMIBalance: Math.max(0, totalDue - allocationAmount),
        },
      ],
      totalPrincipalPaid: allocation.principalPaid,
      totalInterestPaid: allocation.interestPaid,
      totalPenaltyPaid: allocation.penaltyPaid,
      excessAmount: paymentAmount - allocationAmount,
    };
  }

  /**
   * Allocate payment amount to EMI components (penalty first, then interest, then principal)
   */
  private static allocateAmountToEMIComponents(
    emi: EMI,
    paymentAmount: number,
    currentPaid: number
  ): {
    principalPaid: number;
    interestPaid: number;
    penaltyPaid: number;
  } {
    let remainingAmount = paymentAmount;
    let principalPaid = 0;
    let interestPaid = 0;
    let penaltyPaid = 0;

    const totalPrincipal = EMICalculationService.decimalToNumber(emi.principalAmount);
    const totalInterest = EMICalculationService.decimalToNumber(emi.interestAmount);
    const totalPenalty = EMICalculationService.decimalToNumber(
      emi.penaltyAmount || new Prisma.Decimal(0)
    );

    // Calculate how much of each component is already paid
    const allocationRatio =
      totalPrincipal + totalInterest > 0 ? totalPrincipal / (totalPrincipal + totalInterest) : 0.5;

    const paidPrincipal = currentPaid * allocationRatio;
    const paidInterest = currentPaid - paidPrincipal;

    // 1. Pay penalty first
    const unpaidPenalty = Math.max(0, totalPenalty);
    if (remainingAmount > 0 && unpaidPenalty > 0) {
      penaltyPaid = Math.min(remainingAmount, unpaidPenalty);
      remainingAmount -= penaltyPaid;
    }

    // 2. Pay interest
    const unpaidInterest = Math.max(0, totalInterest - paidInterest);
    if (remainingAmount > 0 && unpaidInterest > 0) {
      interestPaid = Math.min(remainingAmount, unpaidInterest);
      remainingAmount -= interestPaid;
    }

    // 3. Pay principal
    const unpaidPrincipal = Math.max(0, totalPrincipal - paidPrincipal);
    if (remainingAmount > 0 && unpaidPrincipal > 0) {
      principalPaid = Math.min(remainingAmount, unpaidPrincipal);
      remainingAmount -= principalPaid;
    }

    return {
      principalPaid: Math.round(principalPaid * 100) / 100,
      interestPaid: Math.round(interestPaid * 100) / 100,
      penaltyPaid: Math.round(penaltyPaid * 100) / 100,
    };
  }

  /**
   * Update EMIs based on payment allocation
   */
  private static async updateEMIsFromAllocation(
    allocations: PaymentAllocation[],
    tx: Prisma.TransactionClient
  ): Promise<EMI[]> {
    const updatedEMIs: EMI[] = [];

    for (const allocation of allocations) {
      const emi = await tx.eMI.findUnique({ where: { id: allocation.emiId } });
      if (!emi) continue;

      const currentPaid = EMICalculationService.decimalToNumber(
        emi.paidAmount || new Prisma.Decimal(0)
      );
      const newPaidAmount = currentPaid + allocation.totalAllocated;
      const totalDue =
        EMICalculationService.decimalToNumber(emi.totalAmount) +
        EMICalculationService.decimalToNumber(emi.penaltyAmount || new Prisma.Decimal(0));

      // Determine new status
      let newStatus = emi.status;
      if (newPaidAmount >= totalDue) {
        newStatus = 'PAID';
      } else if (newPaidAmount > 0) {
        newStatus = 'PARTIAL_PAID';
      }

      const updatedEMI = await tx.eMI.update({
        where: { id: allocation.emiId },
        data: {
          paidAmount: new Prisma.Decimal(newPaidAmount),
          balanceAmount: new Prisma.Decimal(Math.max(0, totalDue - newPaidAmount)),
          status: newStatus,
          paidDate: newStatus === 'PAID' ? new Date() : emi.paidDate,
        },
      });

      updatedEMIs.push(updatedEMI);
    }

    return updatedEMIs;
  }

  /**
   * Process bulk payment (multiple EMIs at once)
   */
  static async processBulkPayment(
    input: PaymentInput & {
      targetEMIIds?: number[];
      payForMonths?: number;
    }
  ): Promise<PaymentResult> {
    const bulkInput = { ...input, paymentType: 'BULK_PAYMENT' as PaymentType };

    if (input.targetEMIIds && input.targetEMIIds.length > 0) {
      // Process payment for specific EMIs
      return await this.processPaymentForSpecificEMIs(bulkInput, input.targetEMIIds);
    } else if (input.payForMonths) {
      // Process payment for next N months
      return await this.processPaymentForNextMonths(bulkInput, input.payForMonths);
    } else {
      // Standard allocation
      return await this.recordPayment(bulkInput);
    }
  }

  /**
   * Process payment for specific EMI IDs
   */
  private static async processPaymentForSpecificEMIs(
    input: PaymentInput,
    emiIds: number[]
  ): Promise<PaymentResult> {
    return await prisma.$transaction(async tx => {
      const emis = await tx.eMI.findMany({
        where: { id: { in: emiIds }, loanId: input.loanId, isActive: true },
        orderBy: { emiNumber: 'asc' },
      });

      if (emis.length === 0) {
        throw new Error('No valid EMIs found for payment');
      }

      // Calculate total due for selected EMIs
      const totalDue = emis.reduce((sum, emi) => {
        const currentPaid = EMICalculationService.decimalToNumber(
          emi.paidAmount || new Prisma.Decimal(0)
        );
        const totalEMI = EMICalculationService.decimalToNumber(emi.totalAmount);
        const penalty = EMICalculationService.decimalToNumber(
          emi.penaltyAmount || new Prisma.Decimal(0)
        );
        return sum + Math.max(0, totalEMI + penalty - currentPaid);
      }, 0);

      if (input.amount > totalDue * 1.1) {
        // Allow 10% excess
        throw new Error(
          `Payment amount (₹${input.amount}) is significantly higher than total due (₹${totalDue})`
        );
      }

      return await this.recordPayment(input);
    });
  }

  /**
   * Process payment for next N months
   */
  private static async processPaymentForNextMonths(
    input: PaymentInput,
    months: number
  ): Promise<PaymentResult> {
    const nextEMIs = await prisma.eMI.findMany({
      where: {
        loanId: input.loanId,
        isActive: true,
        status: { in: ['PENDING', 'PARTIAL_PAID', 'OVERDUE'] },
      },
      orderBy: [
        { status: 'desc' }, // Overdue first
        { dueDate: 'asc' },
      ],
      take: months,
    });

    const emiIds = nextEMIs.map(emi => emi.id);
    return await this.processPaymentForSpecificEMIs(input, emiIds);
  }

  /**
   * Reverse a payment
   */
  static async reversePayment(
    paymentId: number,
    reversalReason: string,
    reversedBy: number
  ): Promise<Payment> {
    return await prisma.$transaction(async tx => {
      const originalPayment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { loan: true },
      });

      if (!originalPayment || !originalPayment.isActive) {
        throw new Error('Payment not found or already inactive');
      }

      if (originalPayment.status === 'REVERSED') {
        throw new Error('Payment is already reversed');
      }

      // Create reversal payment record
      const reversalPaymentNumber = await this.generatePaymentNumber();
      const reversalPayment = await tx.payment.create({
        data: {
          paymentNumber: reversalPaymentNumber,
          loanId: originalPayment.loanId,
          borrowerId: originalPayment.borrowerId,
          amount: originalPayment.amount.mul(-1), // Negative amount
          paymentMethod: originalPayment.paymentMethod,
          paymentType: 'REVERSAL',
          paymentDate: new Date(),
          principalPaid: originalPayment.principalPaid?.mul(-1) || new Prisma.Decimal(0),
          interestPaid: originalPayment.interestPaid?.mul(-1) || new Prisma.Decimal(0),
          penaltyPaid: originalPayment.penaltyPaid?.mul(-1) || new Prisma.Decimal(0),
          outstandingBeforePayment: originalPayment.outstandingAfterPayment,
          outstandingAfterPayment: originalPayment.outstandingBeforePayment,
          isReversal: true,
          remarks: `Reversal of payment ${originalPayment.paymentNumber}: ${reversalReason}`,
          processedBy: reversedBy,
          status: 'COMPLETED',
        },
      });

      // Update original payment
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REVERSED',
          reversalPaymentId: reversalPayment.id,
        },
      });

      // Revert loan balance
      await tx.loan.update({
        where: { id: originalPayment.loanId },
        data: {
          outstandingAmount: originalPayment.outstandingBeforePayment,
          totalPaidAmount: {
            decrement: originalPayment.amount,
          },
        },
      });

      // Revert EMI payments if allocation data exists
      if (originalPayment.allocatedEMIs) {
        const allocations = originalPayment.allocatedEMIs as unknown as PaymentAllocation[];
        await this.revertEMIAllocations(allocations, tx);
      }

      return reversalPayment;
    });
  }

  /**
   * Revert EMI allocations
   */
  private static async revertEMIAllocations(
    allocations: PaymentAllocation[],
    tx: Prisma.TransactionClient
  ): Promise<void> {
    for (const allocation of allocations) {
      const emi = await tx.eMI.findUnique({ where: { id: allocation.emiId } });
      if (!emi) continue;

      const currentPaid = EMICalculationService.decimalToNumber(
        emi.paidAmount || new Prisma.Decimal(0)
      );
      const newPaidAmount = Math.max(0, currentPaid - allocation.totalAllocated);
      const totalDue =
        EMICalculationService.decimalToNumber(emi.totalAmount) +
        EMICalculationService.decimalToNumber(emi.penaltyAmount || new Prisma.Decimal(0));

      // Determine reverted status
      let newStatus: 'PENDING' | 'PAID' | 'PARTIAL_PAID' | 'OVERDUE' = 'PENDING';
      if (newPaidAmount >= totalDue) {
        newStatus = 'PAID';
      } else if (newPaidAmount > 0) {
        newStatus = 'PARTIAL_PAID';
      } else if (emi.dueDate < new Date()) {
        newStatus = 'OVERDUE';
      }

      await tx.eMI.update({
        where: { id: allocation.emiId },
        data: {
          paidAmount: new Prisma.Decimal(newPaidAmount),
          balanceAmount: new Prisma.Decimal(totalDue - newPaidAmount),
          status: newStatus,
          paidDate: newStatus === 'PAID' ? emi.paidDate : null,
        },
      });
    }
  }

  /**
   * Generate unique payment number
   */
  private static async generatePaymentNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');

    const paymentCount = await prisma.payment.count({
      where: {
        createdAt: {
          gte: new Date(year, new Date().getMonth(), new Date().getDate()),
          lt: new Date(year, new Date().getMonth(), new Date().getDate() + 1),
        },
      },
    });

    const sequence = String(paymentCount + 1).padStart(4, '0');
    return `PAY${year}${month}${day}${sequence}`;
  }

  /**
   * Get payment history for a loan
   */
  static async getPaymentHistory(
    loanId: number,
    limit?: number,
    offset?: number
  ): Promise<Payment[]> {
    return await prisma.payment.findMany({
      where: { loanId, isActive: true },
      orderBy: { paymentDate: 'desc' },
      take: limit,
      skip: offset,
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
    const pendingEMIs = await prisma.eMI.findMany({
      where: {
        loanId,
        isActive: true,
        status: { in: ['PENDING', 'PARTIAL_PAID', 'OVERDUE'] },
      },
      orderBy: [{ status: 'desc' }, { dueDate: 'asc' }],
    });

    let remainingAmount = paymentAmount;
    let totalPrincipal = 0;
    let totalInterest = 0;
    let totalPenalty = 0;
    let affectedEMIs = 0;

    for (const emi of pendingEMIs) {
      if (remainingAmount <= 0) break;

      const currentPaid = EMICalculationService.decimalToNumber(
        emi.paidAmount || new Prisma.Decimal(0)
      );
      const totalEMI = EMICalculationService.decimalToNumber(emi.totalAmount);
      const penalty = EMICalculationService.decimalToNumber(
        emi.penaltyAmount || new Prisma.Decimal(0)
      );
      const totalDue = totalEMI + penalty - currentPaid;

      if (totalDue <= 0) continue;

      const allocationAmount = Math.min(remainingAmount, totalDue);
      const allocation = this.allocateAmountToEMIComponents(emi, allocationAmount, currentPaid);

      totalPrincipal += allocation.principalPaid;
      totalInterest += allocation.interestPaid;
      totalPenalty += allocation.penaltyPaid;
      remainingAmount -= allocationAmount;
      affectedEMIs++;
    }

    const nextEMI = pendingEMIs.find(emi => {
      const currentPaid = EMICalculationService.decimalToNumber(
        emi.paidAmount || new Prisma.Decimal(0)
      );
      const totalDue =
        EMICalculationService.decimalToNumber(emi.totalAmount) +
        EMICalculationService.decimalToNumber(emi.penaltyAmount || new Prisma.Decimal(0));
      return totalDue > currentPaid;
    });

    return {
      totalPrincipal: Math.round(totalPrincipal * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPenalty: Math.round(totalPenalty * 100) / 100,
      affectedEMIs,
      excessAmount: Math.round(remainingAmount * 100) / 100,
      nextEMIDue: nextEMI?.dueDate,
    };
  }
}
