import { Router } from 'express';
import { PaymentController } from '../controller/payment.controller';

const router = Router();

// Payment Recording Routes
router.post('/record', PaymentController.recordPayment);
router.post('/bulk', PaymentController.processBulkPayment);
router.post('/calculate-breakdown', PaymentController.calculatePaymentBreakdown);

// Payment Retrieval Routes
router.get('/all', PaymentController.getAllPayments);
router.get('/overdue', PaymentController.getOverduePayments);
router.get('/payment/:paymentId', PaymentController.getPaymentById);
router.get('/number/:paymentNumber', PaymentController.getPaymentByNumber);
router.get('/loan/:loanId/history', PaymentController.getPaymentHistory);
router.get('/borrower/:borrowerId', PaymentController.getPaymentsByBorrower);

// Payment Management Routes
router.patch('/:paymentId/status', PaymentController.updatePaymentStatus);
router.post('/reverse', PaymentController.reversePayment);

// Reports and Analytics Routes
router.get('/reports/daily', PaymentController.getDailyCollection);
router.get('/reports/monthly', PaymentController.getMonthlyCollection);
router.get('/reports/statistics', PaymentController.getPaymentStatistics);

export default router;
