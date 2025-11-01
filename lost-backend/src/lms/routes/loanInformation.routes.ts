import { Router } from 'express';
import { LoanInformationController } from '../controller/loanInformation.controller';

const router = Router();

// Loan Details Routes
router.get('/loan/:loanId/details', LoanInformationController.getLoanDetails);
router.get('/loan/:loanId/overview', LoanInformationController.getLoanOverview);
router.get('/loan/:loanId/payment-summary', LoanInformationController.getLoanPaymentSummary);
router.get('/loan/:loanId/analytics', LoanInformationController.getLoanAnalytics);

// EMI Schedule Routes
router.get('/loan/:loanId/emi-schedule', LoanInformationController.getEMIScheduleWithPayments);
router.get('/loan/:loanId/repayment-status', LoanInformationController.getRepaymentStatus);

// User Dashboard Routes
router.get('/user/:userId/dashboard', LoanInformationController.getUserDashboard);
router.get('/user/:userId/loans', LoanInformationController.getUserLoans);
router.get('/user/:userId/payment-history', LoanInformationController.getUserPaymentHistory);
router.get('/user/:userId/alerts', LoanInformationController.getUserAlerts);

export default router;
