/* eslint-disable no-console */
import express, { Express } from 'express';
import { CustomerFile } from '../../schema';
import deleteAllDataByOrganizationId from './deleteAllDataByOrganizationId';
import updateAllEmployeesDob from './employee/updateAllEmployeesDob';
import updateAllEmployeesJoiningDate from './employee/updateAllEmployeesJoiningDate';
import updateAllEmployess from './employee/updateAllEmployess';
import deleteAllTasks from './tasks/deleteAllTasks';
import deleteAllUsers from './users/deleteAllUsers';
import updateAllUsers from './users/updateAllUsers';

const router: Express = express();

router.get('/updateFileLoanType', async (req, res) => {
  const allCusomterFilesData = await CustomerFile.find().lean();
  for (const file of allCusomterFilesData) {
    const loanType = file.loanType?.toLowerCase();
    if (!loanType) {
      console.log('LOAN TYPE NOT AVAILABLE', file._id);
    }

    if (loanType === 'home loan') {
      await CustomerFile.updateOne({ _id: file._id }, { $set: { loanType: 'HOME_LOAN' } });
    }
    if (loanType === 'vehicle loan') {
      await CustomerFile.updateOne({ _id: file._id }, { $set: { loanType: 'VEHICLE_LOAN' } });
    }
    if (loanType === 'personal loan') {
      await CustomerFile.updateOne({ _id: file._id }, { $set: { loanType: 'PERSONAL_LOAN' } });
    }
  }
  res.send({ message: 'SUCCESS' });
});

router.get('/updateFileStatus', async (req, res) => {
  const allCusomterFilesData = await CustomerFile.find().lean();
  for (const file of allCusomterFilesData) {
    const loanType = file.status?.toLowerCase();
    if (!loanType) {
      console.log('LOAN STATUS NOT AVAILABLE', file._id);
    }

    if (loanType === 'approved') {
      await CustomerFile.updateOne({ _id: file._id }, { $set: { status: 'APPROVED' } });
    }
    if (loanType === 'pending') {
      await CustomerFile.updateOne({ _id: file._id }, { $set: { status: 'PENDING' } });
    }
    if (loanType === 'task pending') {
      await CustomerFile.updateOne({ _id: file._id }, { $set: { status: 'TASK_PENDING' } });
    }
    if (loanType === 'review') {
      await CustomerFile.updateOne({ _id: file._id }, { $set: { status: 'UNDER_REVIEW' } });
    }
    if (loanType === 'rejected') {
      await CustomerFile.updateOne({ _id: file._id }, { $set: { status: 'REJECTED' } });
    }
  }
  res.send({ message: 'SUCCESS' });
});
router.get('/deleteAllTasks', deleteAllTasks);
router.get('/deleteAllUsers', deleteAllUsers);
router.get('/updateAllEmployess', updateAllEmployess);
router.get('/updateAllEmployeesDob', updateAllEmployeesDob);
router.get('/updateAllEmployeesJoiningDate', updateAllEmployeesJoiningDate);
router.get('/updateAllUsers', updateAllUsers);
router.get('/deleteAllDataByOrganizationId', deleteAllDataByOrganizationId);

export default router;
