import { Router } from 'express';
import emiRoutes from './emi.routes';
import loanRoutes from './loan.routes';
import loanInformationRoutes from './loanInformation.routes';
import paymentRoutes from './payment.routes';
import userRoutes from './user.routes';

const postgresRoutes = Router();

postgresRoutes.use('/users', userRoutes);
postgresRoutes.use('/emis', emiRoutes);
postgresRoutes.use('/payments', paymentRoutes);
postgresRoutes.use('/info', loanInformationRoutes);
postgresRoutes.use('/loans', loanRoutes);

postgresRoutes.get('/test', (_, res) => {
  res.json({
    success: true,
    message: 'PostgreSQL routes are working!',
    timestamp: new Date().toISOString(),
  });
});

export default postgresRoutes;
