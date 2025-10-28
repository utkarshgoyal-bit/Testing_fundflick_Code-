import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashBoardWrapper from '@/components/shared/DashBoardWrapper';
import PageHeader from '@/components/shared/pageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';
import EMIScheduleTable from './components/EMIScheduleTable';

import getStatusColor from '@/helpers/getStatusColor';
import { EMISchedule, Loan } from '@/lib/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_LOAN_BY_ID } from '@/redux/actions/types';
import { RootState } from '@/redux/store';

const FileDetails: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const dispatch = useDispatch();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [_, setEmiSchedule] = useState<EMISchedule[]>([]);
  const { data: loanDetails, loading: loanDetailsLoading } = useSelector((state: RootState) => state.loanById);
  const {
    id: loanId,
    loanNumber,
    borrower,
    loanStatus,
    roundedPrincipalAmount: principalAmount,
    roundedOutstandingAmount: outStandingAmount,
    roundedTotalPaidAmount: paymentAmount,
    rounedPenaltyAmount: penaltyAmount,
    emiAmount,
    totalPaidAmount,
    emis,
  } = loanDetails;
  const { name: borrowerName, email: borrowerEmail, phoneNumber: borrowerPhone } = borrower || {};

  const fetchLoanById = useCallback(() => {
    dispatch({ type: FETCH_LOAN_BY_ID, payload: { loanId: fileId } });
  }, [fileId]);

  // Mock data - in a real app, you'd fetch this based on the `id`
  const mockLoan: Loan = {
    id: 1,
    loanNumber: 'LN202412001',
    borrowerName: 'Rajesh Kumar',
    borrowerEmail: 'rajesh.kumar@example.com',
    borrowerPhone: '+91-9876543210',
    loanType: 'HOME_LOAN',
    principalAmount: 2500000,
    interestRate: 8.5,
    tenure: 240,
    emiAmount: 21506,
    outstandingAmount: 2350000,
    totalPaidAmount: 150000,
    status: 'ACTIVE',
    nextEMIDueDate: '2024-12-01',
    disbursementDate: '2024-01-01',
    maturityDate: '2044-01-01',
    completionPercentage: 6,
    onTimePaymentPercentage: 100,
    createdAt: '2024-01-01',
    updatedAt: '2024-11-25',
  };

  const mockEmiSchedule: EMISchedule[] = [
    {
      emiId: 1,
      emiNumber: 1,
      dueDate: '2024-02-01',
      principalAmount: 5000,
      interestAmount: 16506,
      totalAmount: 21506,
      status: 'PAID',
      paidAmount: 21506,
      paidDate: '2024-02-01',
      lateDays: 0,
    },
    {
      emiId: 2,
      emiNumber: 2,
      dueDate: '2024-03-01',
      principalAmount: 5050,
      interestAmount: 16456,
      totalAmount: 21506,
      status: 'PAID',
      paidAmount: 21506,
      paidDate: '2024-03-01',
      lateDays: 0,
    },
    {
      emiId: 3,
      emiNumber: 3,
      dueDate: '2024-04-01',
      principalAmount: 5100,
      interestAmount: 16406,
      totalAmount: 21506,
      status: 'PAID',
      paidAmount: 21506,
      paidDate: '2024-04-01',
      lateDays: 0,
    },
    {
      emiId: 10,
      emiNumber: 10,
      dueDate: '2024-11-01',
      principalAmount: 5450,
      interestAmount: 16056,
      totalAmount: 21506,
      status: 'PAID',
      paidAmount: 21506,
      paidDate: '2024-11-01',
      lateDays: 0,
    },
    {
      emiId: 11,
      emiNumber: 11,
      dueDate: '2024-12-01',
      principalAmount: 5500,
      interestAmount: 16006,
      totalAmount: 21506,
      status: 'PENDING',
      paidAmount: 0,
      lateDays: 0,
    },
    {
      emiId: 12,
      emiNumber: 12,
      dueDate: '2025-01-01',
      principalAmount: 5550,
      interestAmount: 15956,
      totalAmount: 21506,
      status: 'PENDING',
      paidAmount: 0,
      lateDays: 0,
    },
  ];

  useEffect(() => {
    setLoan(mockLoan);
    setEmiSchedule(mockEmiSchedule);
    fetchLoanById();
  }, [fileId]);

  if (!loan || loanDetailsLoading) {
    return (
      <DashBoardWrapper>
        <PageHeader title="Loading..." />
        <div className="mt-6">Loading loan details...</div>
      </DashBoardWrapper>
    );
  }

  return (
    <DashBoardWrapper>
      <Helmet>
        <title>{`LMS | ${loanNumber}`}</title>
      </Helmet>
      <PageHeader
        title={`File Details - ${loanNumber}`}
        subtitle={`Details for loan file ${loanNumber}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Loan Management', href: '/loan-management' },
          { label: 'File Details' },
        ]}
        actions={<Button>Edit Loan</Button>}
      />
      <div className="mt-6 space-y-6">
        {/* Borrower Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Borrower Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-fg-secondary">Name</p>
              <p className="font-medium">{borrowerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-fg-secondary">Email</p>
              <p className="font-medium">{borrowerEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-fg-secondary">Phone</p>
              <p className="font-medium">{borrowerPhone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-fg-secondary">Status</p>
              <Badge className={getStatusColor(loanStatus)}>{loanStatus}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Loan Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Loan Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-fg-secondary">Principal Amount</p>
              <p className="text-xl font-bold">
                <I8nCurrencyWrapper value={principalAmount} precision={0} />
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-fg-secondary">Outstanding</p>
              <p className="text-xl font-bold text-color-warning">
                <I8nCurrencyWrapper value={outStandingAmount} precision={0} />
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-fg-secondary">Paid Amount</p>
              <p className="text-xl font-bold text-color-success">
                <I8nCurrencyWrapper value={paymentAmount} precision={0} />
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-fg-secondary">EMI Amount</p>
              <p className="text-xl font-bold">
                <I8nCurrencyWrapper value={emiAmount} precision={0} />
              </p>
            </div>
          </CardContent>
        </Card>

        {/* EMI Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">EMI Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <EMIScheduleTable
              loanId={loanId}
              loanNumber={loanNumber}
              borrowerName={borrowerName}
              onRecordPayment={(emiId) => {
                console.log('Record payment for EMI:', emiId);
              }}
              emis={emis}
              emiSchedule={[]}
              penaltyAmount={penaltyAmount}
              totalPaidAmount={totalPaidAmount}
              outStandingAmount={outStandingAmount}
              loading={loanDetailsLoading}
            />
          </CardContent>
        </Card>
      </div>
    </DashBoardWrapper>
  );
};

export default FileDetails;
