import { EMI, Loan, LoanStatus, LoanType, Payment, Prisma, User } from '@prisma/client';
import NP from 'number-precision';
import OrganizationSchema from '../../schema/organization';
import { EMICalculationService } from '../service/emiCalculation.service';
import { EMIScheduleService } from '../service/emiSchedule.service';
import prisma from './prisma';
export interface LoanWithRelations extends Loan {
  borrower: User;
  emis: EMI[];
  payments: Payment[];
}

export interface CreateLoanInput {
  principalAmount: number;
  interestRate: number;
  tenure: number;
  loanType: LoanType;
  purpose?: string;
  fileId: number;
  processingFee?: number;
  orgName: string;
  organization: string;
  email?: string;
  userDetails: {
    customerName: string;
    phoneNumber: string;
    email: string;
    panNumber: string;
    aadharNumber: string;
    city: string;
    state: string;
    pinCode: string;
    monthlyIncome: number;
    isActive?: boolean;
    customerId: string;
  };
}

export class LoanModel {
  /**
   * Create a new loan
   */
  static async create({
    loanData,
    createdBy,
  }: {
    loanData: CreateLoanInput;
    createdBy: string;
  }): Promise<Loan> {
    const orgDetails = await OrganizationSchema.findById(loanData.organization).lean();
    const orgName = orgDetails?.name || '';
    const loanNumber = await this.generateLoanNumber({ prefixName: orgName });

    // Calculate EMI amount
    const emiAmount = EMICalculationService.calculateEMIAmount(
      loanData.principalAmount,
      loanData.interestRate,
      loanData.tenure
    );

    // First, find or create a User with the given PAN/Aadhaar
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { panNumber: loanData.userDetails.panNumber },
          { aadharNumber: loanData.userDetails.aadharNumber },
        ],
      },
    });

    if (!user) {
      const userEmail = `${loanData.userDetails.panNumber.toLowerCase()}@loan.user`;
      user = await prisma.user.create({
        data: {
          id: loanData.fileId,
          userId: loanData.userDetails.customerId,
          email: loanData.userDetails.email || userEmail,
          name: loanData.userDetails.customerName,
          phoneNumber: loanData.userDetails.phoneNumber,
          panNumber: loanData.userDetails.panNumber,
          aadharNumber: loanData.userDetails.aadharNumber,
          city: loanData.userDetails.city || 'N/A',
          state: loanData.userDetails.state || 'N/A',
          pinCode: loanData.userDetails.pinCode || 'N/A',
          monthlyIncome: loanData.userDetails.monthlyIncome || 0,
          isActive: loanData.userDetails.isActive || false,
          userType: 'BORROWER',
          createdBy,
        },
      });
    }

    const finalLoanloanData: Prisma.LoanCreateInput = {
      id: loanData.fileId,
      orgName: loanData.orgName,
      organization: loanData.organization,
      loanNumber,
      principalAmount: new Prisma.Decimal(loanData.principalAmount),
      roundedPrincipalAmount: NP.round(loanData.principalAmount, 0),
      interestRate: new Prisma.Decimal(loanData.interestRate),
      tenure: loanData.tenure,
      emiAmount: new Prisma.Decimal(emiAmount),
      roundedEmiAmount: NP.round(emiAmount, 0),
      loanType: loanData.loanType,
      purpose: loanData.purpose,
      processingFee: new Prisma.Decimal(loanData.processingFee || 0),
      outstandingAmount: new Prisma.Decimal(loanData.principalAmount),
      roundedOutstandingAmount: NP.round(loanData.principalAmount, 0),
      loanStatus: LoanStatus.ACTIVE,
      borrower: {
        connect: { id: user.id },
      },
      createdBy,
    };

    return await prisma.loan.create({
      data: finalLoanloanData,
    });
  }

  /**
   * Get all loans with optional filtering
   */
  static async findAll(filters?: {
    borrowerId?: number;
    loanStatus?: LoanStatus;
    loanType?: LoanType;
    limit?: number;
    offset?: number;
  }): Promise<Loan[]> {
    const where: Prisma.LoanWhereInput = {
      isActive: true,
    };

    if (filters?.borrowerId) {
      where.borrowerId = filters.borrowerId;
    }

    if (filters?.loanStatus) {
      where.loanStatus = filters.loanStatus;
    }

    if (filters?.loanType) {
      where.loanType = filters.loanType;
    }

    return await prisma.loan.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get loan by ID with all relations
   */
  static async findById(id: number): Promise<LoanWithRelations | null> {
    return await prisma.loan.findUnique({
      where: { id },
      include: {
        borrower: true,
        emis: {
          where: { isActive: true },
          orderBy: { emiNumber: 'asc' },
        },
        payments: {
          where: { isActive: true },
          orderBy: { paymentDate: 'desc' },
        },
      },
    });
  }

  /**
   * Get loan by loan number
   */
  static async findByLoanNumber(loanNumber: string): Promise<LoanWithRelations | null> {
    return await prisma.loan.findUnique({
      where: { loanNumber },
      include: {
        borrower: true,
        emis: {
          where: { isActive: true },
          orderBy: { emiNumber: 'asc' },
        },
        payments: {
          where: { isActive: true },
          orderBy: { paymentDate: 'desc' },
        },
      },
    });
  }

  /**
   * Update loan status
   */
  static async updateStatus(id: number, status: LoanStatus): Promise<Loan> {
    const updateData: Prisma.LoanUpdateInput = {
      loanStatus: status,
    };

    // Set dates based on status
    switch (status) {
      case 'APPROVED':
        updateData.approvalDate = new Date();
        break;
      case 'DISBURSED':
        updateData.disbursementDate = new Date();
        updateData.loanStatus = 'ACTIVE'; // Disbursed loans become active
        break;
      case 'COMPLETED':
      case 'CLOSED':
        updateData.outstandingAmount = new Prisma.Decimal(0);
        break;
    }

    return await prisma.loan.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Approve loan and generate EMI schedule
   */
  static async approveLoan(
    id: number,
    disbursementDate?: Date
  ): Promise<{
    loan: Loan;
    emiSchedule: EMI[];
  }> {
    // Update loan status to approved
    const loan = await this.updateStatus(id, 'APPROVED');

    // Generate EMI schedule
    const emiSchedule = await EMIScheduleService.generateEMISchedule({
      loanId: id,
      startDate: disbursementDate,
    });

    return { loan, emiSchedule };
  }

  /**
   * Disburse loan
   */
  static async disburseLoan(id: number): Promise<Loan> {
    return await this.updateStatus(id, 'DISBURSED');
  }

  /**
   * Get loans by borrower
   */
  static async findByBorrowerId(borrowerId: number): Promise<Loan[]> {
    return await prisma.loan.findMany({
      where: { borrowerId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get active loans (disbursed and ongoing)
   */
  static async getActiveLoans(): Promise<Loan[]> {
    return await prisma.loan.findMany({
      where: {
        loanStatus: { in: ['ACTIVE', 'DISBURSED'] },
        isActive: true,
      },
      orderBy: { disbursementDate: 'desc' },
    });
  }

  /**
   * Get loans requiring attention (overdue EMIs)
   */
  static async getLoansWithOverdueEMIs(): Promise<LoanWithRelations[]> {
    return await prisma.loan.findMany({
      where: {
        loanStatus: 'ACTIVE',
        isActive: true,
        emis: {
          some: {
            status: 'OVERDUE',
            isActive: true,
          },
        },
      },
      include: {
        borrower: true,
        emis: {
          where: {
            status: 'OVERDUE',
            isActive: true,
          },
          orderBy: { dueDate: 'asc' },
        },
        payments: {
          where: { isActive: true },
          orderBy: { paymentDate: 'desc' },
          take: 5, // Last 5 payments
        },
      },
    });
  }

  /**
   * Update loan outstanding amount
   */
  static async updateOutstandingAmount(id: number, newAmount: number): Promise<Loan> {
    const loan = await prisma.loan.update({
      where: { id },
      data: {
        outstandingAmount: new Prisma.Decimal(newAmount),
        totalPaidAmount: {
          increment: new Prisma.Decimal(0), // Will be updated by payment processing
        },
      },
    });

    // If outstanding becomes 0, mark loan as completed
    if (newAmount <= 0) {
      await this.updateStatus(id, 'COMPLETED');
    }

    return loan;
  }

  /**
   * Calculate loan summary
   */
  static async getLoanSummary(id: number): Promise<{
    loan: Loan;
    totalPaid: number;
    totalInterestPaid: number;
    totalPenaltyPaid: number;
    remainingAmount: number;
    nextEMIDue: Date | null;
    daysOverdue: number;
  }> {
    const loan = await this.findById(id);
    if (!loan) {
      throw new Error('Loan not found');
    }

    const totalPaid = loan.payments.reduce(
      (sum, payment) => sum + EMICalculationService.decimalToNumber(payment.amount),
      0
    );

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

    const remainingAmount = EMICalculationService.decimalToNumber(
      loan.outstandingAmount || new Prisma.Decimal(0)
    );

    // Find next pending EMI
    const nextEMI = loan.emis.find(emi => emi.status === 'PENDING' || emi.status === 'OVERDUE');
    const nextEMIDue = nextEMI?.dueDate || null;

    // Calculate overdue days
    let daysOverdue = 0;
    if (nextEMI && nextEMI.status === 'OVERDUE') {
      daysOverdue = Math.ceil(
        (new Date().getTime() - nextEMI.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    return {
      loan,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
      totalPenaltyPaid: Math.round(totalPenaltyPaid * 100) / 100,
      remainingAmount: Math.round(remainingAmount * 100) / 100,
      nextEMIDue,
      daysOverdue,
    };
  }

  /**
   * Generate unique loan number
   */
  private static async generateLoanNumber({ prefixName }: { prefixName: string }): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    // Get count of loans created this month
    const startOfMonth = new Date(year, new Date().getMonth(), 1);
    const endOfMonth = new Date(year, new Date().getMonth() + 1, 0);

    const loanCount = await prisma.loan.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const sequence = String(loanCount + 1).padStart(4, '0');
    return `${prefixName || 'LA'}${year}${month}${sequence}`;
  }

  /**
   * Get loan statistics
   */
  static async getStatistics(): Promise<{
    totalLoans: number;
    activeLoans: number;
    completedLoans: number;
    totalDisbursed: number;
    totalOutstanding: number;
    totalCollected: number;
    defaultedLoans: number;
  }> {
    const [
      totalLoans,
      activeLoans,
      completedLoans,
      defaultedLoans,
      disbursementStats,
      outstandingStats,
      collectionStats,
    ] = await Promise.all([
      prisma.loan.count({ where: { isActive: true } }),
      prisma.loan.count({ where: { loanStatus: 'ACTIVE', isActive: true } }),
      prisma.loan.count({ where: { loanStatus: 'COMPLETED', isActive: true } }),
      prisma.loan.count({ where: { loanStatus: 'DEFAULTED', isActive: true } }),
      prisma.loan.aggregate({
        where: { loanStatus: { in: ['ACTIVE', 'COMPLETED', 'DISBURSED'] }, isActive: true },
        _sum: { principalAmount: true },
      }),
      prisma.loan.aggregate({
        where: { loanStatus: 'ACTIVE', isActive: true },
        _sum: { outstandingAmount: true },
      }),
      prisma.payment.aggregate({
        where: { isActive: true, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalLoans,
      activeLoans,
      completedLoans,
      defaultedLoans,
      totalDisbursed: EMICalculationService.decimalToNumber(
        disbursementStats._sum.principalAmount || new Prisma.Decimal(0)
      ),
      totalOutstanding: EMICalculationService.decimalToNumber(
        outstandingStats._sum.outstandingAmount || new Prisma.Decimal(0)
      ),
      totalCollected: EMICalculationService.decimalToNumber(
        collectionStats._sum.amount || new Prisma.Decimal(0)
      ),
    };
  }

  /**
   * Soft delete loan
   */
  static async delete(id: number): Promise<Loan> {
    return await prisma.loan.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
