import { Decimal } from '@prisma/client/runtime/library';
import moment from 'moment';

export interface EMICalculationInput {
  principalAmount: number;
  interestRate: number; // Annual interest rate in percentage
  tenure: number; // Loan tenure in months
  startDate?: Date; // EMI start date, defaults to next month
}

export interface EMIScheduleItem {
  emiNumber: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  outstandingPrincipal: number;
  cumulativePrincipalPaid: number;
  cumulativeInterestPaid: number;
}

export interface EMICalculationResult {
  emiAmount: number;
  totalInterest: number;
  totalAmount: number;
  schedule: EMIScheduleItem[];
}

export class EMICalculationService {
  /**
   * Calculate EMI amount using the standard EMI formula
   * EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1]
   * Where: P = Principal, R = Monthly interest rate, N = Number of months
   */
  static calculateEMIAmount(principal: number, annualRate: number, tenure: number): number {
    const monthlyRate = annualRate / (12 * 100); // Convert annual rate to monthly decimal

    if (monthlyRate === 0) {
      // If interest rate is 0, EMI is just principal divided by tenure
      return principal / tenure;
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    return Math.round(emi * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Generate complete EMI schedule with principal and interest breakdown
   */
  static generateEMISchedule(input: EMICalculationInput): EMICalculationResult {
    const { principalAmount, interestRate, tenure, startDate } = input;

    // Calculate EMI amount
    const emiAmount = this.calculateEMIAmount(principalAmount, interestRate, tenure);
    const monthlyInterestRate = interestRate / (12 * 100);

    // Initialize variables for schedule calculation
    let remainingPrincipal = principalAmount;
    let cumulativePrincipalPaid = 0;
    let cumulativeInterestPaid = 0;
    let totalInterest = 0;

    const schedule: EMIScheduleItem[] = [];

    // Set start date (default to next month if not provided)
    const emiStartDate = startDate ? moment(startDate) : moment().add(1, 'month').startOf('month');

    for (let i = 1; i <= tenure; i++) {
      // Calculate interest for current month
      const interestAmount = remainingPrincipal * monthlyInterestRate;

      // Calculate principal component
      let principalComponent = emiAmount - interestAmount;

      // For last EMI, adjust principal to clear any remaining balance due to rounding
      if (i === tenure) {
        principalComponent = remainingPrincipal;
      }

      // Update cumulative amounts
      cumulativePrincipalPaid += principalComponent;
      cumulativeInterestPaid += interestAmount;
      totalInterest += interestAmount;

      // Calculate outstanding principal after this EMI
      remainingPrincipal -= principalComponent;

      // Due date for this EMI
      const dueDate = emiStartDate
        .clone()
        .add(i - 1, 'month')
        .toDate();

      // Add to schedule
      schedule.push({
        emiNumber: i,
        dueDate,
        principalAmount: Math.round(principalComponent * 100) / 100,
        interestAmount: Math.round(interestAmount * 100) / 100,
        totalAmount: Math.round((principalComponent + interestAmount) * 100) / 100,
        outstandingPrincipal: Math.max(0, Math.round(remainingPrincipal * 100) / 100),
        cumulativePrincipalPaid: Math.round(cumulativePrincipalPaid * 100) / 100,
        cumulativeInterestPaid: Math.round(cumulativeInterestPaid * 100) / 100,
      });
    }

    return {
      emiAmount,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalAmount: Math.round((principalAmount + totalInterest) * 100) / 100,
      schedule,
    };
  }

  /**
   * Calculate remaining EMI schedule after partial payments
   */
  static recalculateSchedule(
    originalPrincipal: number,
    remainingPrincipal: number,
    interestRate: number,
    remainingTenure: number,
    startDate: Date
  ): EMICalculationResult {
    return this.generateEMISchedule({
      principalAmount: remainingPrincipal,
      interestRate,
      tenure: remainingTenure,
      startDate,
    });
  }

  /**
   * Calculate penalty for late EMI payment
   */
  static calculatePenalty(
    emiAmount: number,
    dueDate: Date,
    penaltyRate: number = 2, // Default 2% per month
    paymentDate?: Date
  ): number {
    const actualPaymentDate = paymentDate || new Date();
    const dueMoment = moment(dueDate);
    const paymentMoment = moment(actualPaymentDate);

    if (paymentMoment.isSameOrBefore(dueMoment)) {
      return 0; // No penalty if paid on time
    }

    const daysLate = paymentMoment.diff(dueMoment, 'days');
    const monthsLate = Math.ceil(daysLate / 30); // Consider 30 days as a month

    const penalty = (emiAmount * penaltyRate * monthsLate) / 100;
    return Math.round(penalty * 100) / 100;
  }

  /**
   * Get EMI summary for a loan
   */
  static getEMISummary(schedule: EMIScheduleItem[]): {
    totalEMIs: number;
    totalPrincipal: number;
    totalInterest: number;
    totalAmount: number;
    avgPrincipalPerEMI: number;
    avgInterestPerEMI: number;
  } {
    const totalEMIs = schedule.length;
    const totalPrincipal = schedule.reduce((sum, emi) => sum + emi.principalAmount, 0);
    const totalInterest = schedule.reduce((sum, emi) => sum + emi.interestAmount, 0);
    const totalAmount = totalPrincipal + totalInterest;

    return {
      totalEMIs,
      totalPrincipal: Math.round(totalPrincipal * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      avgPrincipalPerEMI: Math.round((totalPrincipal / totalEMIs) * 100) / 100,
      avgInterestPerEMI: Math.round((totalInterest / totalEMIs) * 100) / 100,
    };
  }

  /**
   * Validate EMI calculation inputs
   */
  static validateEMIInputs(input: EMICalculationInput): string[] {
    const errors: string[] = [];

    if (!input.principalAmount || input.principalAmount <= 0) {
      errors.push('Principal amount must be greater than 0');
    }

    if (input.interestRate < 0 || input.interestRate > 100) {
      errors.push('Interest rate must be between 0 and 100');
    }

    if (!input.tenure || input.tenure <= 0 || input.tenure > 600) {
      errors.push('Tenure must be between 1 and 600 months');
    }

    if (input.startDate && moment(input.startDate).isBefore(moment(), 'day')) {
      errors.push('Start date cannot be in the past');
    }

    return errors;
  }

  /**
   * Convert Decimal values to numbers for calculations
   */
  static decimalToNumber(decimal: Decimal): number {
    return parseFloat(decimal.toString());
  }

  /**
   * Convert numbers to Decimal for database storage
   */
  static numberToDecimal(num: number): Decimal {
    return new Decimal(num);
  }
}
