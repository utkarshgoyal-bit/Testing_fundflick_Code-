import { Router } from 'express';
import { EMIController } from '../controller/emi.controller';

const router = Router();

// EMI Calculation Routes
router.post('/calculate', EMIController.calculateEMI);
router.post('/generate-schedule', EMIController.generateEMISchedule);
router.post('/recalculate-prepayment', EMIController.recalculateAfterPrepayment);

// EMI Schedule Routes
router.get('/schedule/:loanId', EMIController.getEMISchedule);
router.get('/pending/:loanId', EMIController.getPendingEMIs);
router.get('/stats/:loanId', EMIController.getEMIStats);
router.get('/amortization/:loanId', EMIController.getAmortizationChart);

// EMI Management Routes
router.get('/overdue', EMIController.getOverdueEMIs);
router.get('/upcoming', EMIController.getUpcomingEMIs);
router.get('/dashboard-summary', EMIController.getDashboardSummary);
router.get('/:emiId', EMIController.getEMIById);

// EMI Payment and Updates
router.post('/process-payment', EMIController.processEMIPayment);
router.post('/update-overdue', EMIController.updateOverdueEMIs);
router.post('/calculate-penalty/:emiId', EMIController.calculatePenalty);

export default router;
