/* eslint-disable no-console */
import { EMICalculationService } from '../service/emiCalculation.service';

console.log('='.repeat(50));
console.log('EMI CALCULATION TESTING');
console.log('='.repeat(50));

// Test Case 1: Standard Home Loan
console.log('\n🏠 Test Case 1: Home Loan');
console.log('-'.repeat(30));
const homeLoansInput = {
  principalAmount: 1000000, // ₹10 Lakh
  interestRate: 8.5, // 8.5% annual
  tenure: 240, // 20 years (240 months)
};

const homeLoanResult = EMICalculationService.generateEMISchedule(homeLoansInput);
console.log(`Principal Amount: ₹${homeLoansInput.principalAmount.toLocaleString()}`);
console.log(`Interest Rate: ${homeLoansInput.interestRate}% per annum`);
console.log(`Tenure: ${homeLoansInput.tenure} months (${homeLoansInput.tenure / 12} years)`);
console.log(`EMI Amount: ₹${homeLoanResult.emiAmount.toLocaleString()}`);
console.log(`Total Interest: ₹${homeLoanResult.totalInterest.toLocaleString()}`);
console.log(`Total Amount: ₹${homeLoanResult.totalAmount.toLocaleString()}`);

// Show first 5 EMIs
console.log('\nFirst 5 EMI Breakdown:');
console.log('EMI | Principal | Interest | Outstanding');
console.log('-'.repeat(45));
homeLoanResult.schedule.slice(0, 5).forEach(emi => {
  console.log(
    `${emi.emiNumber.toString().padStart(3)} | ` +
      `₹${emi.principalAmount.toLocaleString().padStart(8)} | ` +
      `₹${emi.interestAmount.toLocaleString().padStart(8)} | ` +
      `₹${emi.outstandingPrincipal.toLocaleString().padStart(10)}`
  );
});

// Test Case 2: Personal Loan
console.log('\n\n💰 Test Case 2: Personal Loan');
console.log('-'.repeat(30));
const personalLoanInput = {
  principalAmount: 500000, // ₹5 Lakh
  interestRate: 12.0, // 12% annual
  tenure: 60, // 5 years (60 months)
};

const personalLoanResult = EMICalculationService.generateEMISchedule(personalLoanInput);
console.log(`Principal Amount: ₹${personalLoanInput.principalAmount.toLocaleString()}`);
console.log(`Interest Rate: ${personalLoanInput.interestRate}% per annum`);
console.log(`Tenure: ${personalLoanInput.tenure} months (${personalLoanInput.tenure / 12} years)`);
console.log(`EMI Amount: ₹${personalLoanResult.emiAmount.toLocaleString()}`);
console.log(`Total Interest: ₹${personalLoanResult.totalInterest.toLocaleString()}`);
console.log(`Total Amount: ₹${personalLoanResult.totalAmount.toLocaleString()}`);

// Show first 3 and last 3 EMIs
console.log('\nFirst 3 EMI Breakdown:');
console.log('EMI | Principal | Interest | Outstanding');
console.log('-'.repeat(45));
personalLoanResult.schedule.slice(0, 3).forEach(emi => {
  console.log(
    `${emi.emiNumber.toString().padStart(3)} | ` +
      `₹${emi.principalAmount.toLocaleString().padStart(8)} | ` +
      `₹${emi.interestAmount.toLocaleString().padStart(8)} | ` +
      `₹${emi.outstandingPrincipal.toLocaleString().padStart(10)}`
  );
});

console.log('\nLast 3 EMI Breakdown:');
console.log('EMI | Principal | Interest | Outstanding');
console.log('-'.repeat(45));
personalLoanResult.schedule.slice(-3).forEach(emi => {
  console.log(
    `${emi.emiNumber.toString().padStart(3)} | ` +
      `₹${emi.principalAmount.toLocaleString().padStart(8)} | ` +
      `₹${emi.interestAmount.toLocaleString().padStart(8)} | ` +
      `₹${emi.outstandingPrincipal.toLocaleString().padStart(10)}`
  );
});

// Test Case 3: Car Loan with Zero Interest
console.log('\n\n🚗 Test Case 3: Car Loan (0% Interest)');
console.log('-'.repeat(30));
const carLoanInput = {
  principalAmount: 800000, // ₹8 Lakh
  interestRate: 0, // 0% interest
  tenure: 48, // 4 years (48 months)
};

const carLoanResult = EMICalculationService.generateEMISchedule(carLoanInput);
console.log(`Principal Amount: ₹${carLoanInput.principalAmount.toLocaleString()}`);
console.log(`Interest Rate: ${carLoanInput.interestRate}% per annum`);
console.log(`Tenure: ${carLoanInput.tenure} months (${carLoanInput.tenure / 12} years)`);
console.log(`EMI Amount: ₹${carLoanResult.emiAmount.toLocaleString()}`);
console.log(`Total Interest: ₹${carLoanResult.totalInterest.toLocaleString()}`);
console.log(`Total Amount: ₹${carLoanResult.totalAmount.toLocaleString()}`);

// Test Case 4: Penalty Calculation
console.log('\n\n⚠️  Test Case 4: Penalty Calculation');
console.log('-'.repeat(30));
const dueDate = new Date('2024-01-15');
const paymentDate = new Date('2024-02-20'); // 36 days late
const emiAmount = 25000;

const penalty = EMICalculationService.calculatePenalty(
  emiAmount,
  dueDate,
  2, // 2% penalty rate
  paymentDate
);

console.log(`EMI Amount: ₹${emiAmount.toLocaleString()}`);
console.log(`Due Date: ${dueDate.toDateString()}`);
console.log(`Payment Date: ${paymentDate.toDateString()}`);
console.log(
  `Days Late: ${Math.ceil((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))}`
);
console.log(`Penalty Rate: 2% per month`);
console.log(`Penalty Amount: ₹${penalty.toLocaleString()}`);

// Test Case 5: Input Validation
console.log('\n\n✅ Test Case 5: Input Validation');
console.log('-'.repeat(30));

const invalidInputs = [
  { principalAmount: -100000, interestRate: 8.5, tenure: 60 },
  { principalAmount: 100000, interestRate: -5, tenure: 60 },
  { principalAmount: 100000, interestRate: 8.5, tenure: 0 },
  { principalAmount: 100000, interestRate: 8.5, tenure: 700 }, // Too long
];

invalidInputs.forEach((input, index) => {
  const errors = EMICalculationService.validateEMIInputs(input);
  console.log(`Invalid Input ${index + 1}:`, input);
  console.log(`Validation Errors:`, errors);
  console.log('');
});

// Test Case 6: EMI Summary
console.log('\n\n📊 Test Case 6: EMI Summary');
console.log('-'.repeat(30));
const summary = EMICalculationService.getEMISummary(personalLoanResult.schedule);
console.log('Personal Loan Summary:');
console.log(`Total EMIs: ${summary.totalEMIs}`);
console.log(`Total Principal: ₹${summary.totalPrincipal.toLocaleString()}`);
console.log(`Total Interest: ₹${summary.totalInterest.toLocaleString()}`);
console.log(`Total Amount: ₹${summary.totalAmount.toLocaleString()}`);
console.log(`Average Principal per EMI: ₹${summary.avgPrincipalPerEMI.toLocaleString()}`);
console.log(`Average Interest per EMI: ₹${summary.avgInterestPerEMI.toLocaleString()}`);

// Test Case 7: Recalculation after prepayment
console.log('\n\n🎯 Test Case 7: Recalculation After Prepayment');
console.log('-'.repeat(30));
const originalPrincipal = 500000;
const remainingPrincipal = 300000; // After paying ₹2 lakh as prepayment
const remainingTenure = 36; // 36 months left
const startDate = new Date('2024-03-01');

const recalculatedSchedule = EMICalculationService.recalculateSchedule(
  originalPrincipal,
  remainingPrincipal,
  12.0, // 12% interest
  remainingTenure,
  startDate
);

console.log(`Original Principal: ₹${originalPrincipal.toLocaleString()}`);
console.log(`Remaining Principal: ₹${remainingPrincipal.toLocaleString()}`);
console.log(`Remaining Tenure: ${remainingTenure} months`);
console.log(`New EMI Amount: ₹${recalculatedSchedule.emiAmount.toLocaleString()}`);
console.log(`New Total Interest: ₹${recalculatedSchedule.totalInterest.toLocaleString()}`);

console.log('\n' + '='.repeat(50));
console.log('✅ All EMI calculations completed successfully!');
console.log('='.repeat(50));

// Export for potential use in other test files
export {
  homeLoansInput,
  homeLoanResult,
  personalLoanInput,
  personalLoanResult,
  carLoanInput,
  carLoanResult,
};
