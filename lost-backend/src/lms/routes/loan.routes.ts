import { Router } from 'express';
import { LoanController } from '../controller/loan.controller';

const router = Router();

// Loan Creation and Management Routes
router.post('/', LoanController.createLoan);
router.get('/', LoanController.getAllLoans);
router.get('/:loanId', LoanController.getLoanById);
router.post('/calculate-emi', LoanController.calculateEMI);
router.get('/:loanId/summary', LoanController.getLoanSummary);

// Loan Approval Routes
router.post('/:loanId/approve', LoanController.approveLoan);

// Loan Statistics Routes
router.get('/reports/statistics', LoanController.getLoanStatistics);

export default router;
