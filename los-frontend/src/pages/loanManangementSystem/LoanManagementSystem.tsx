import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import DashBoardWrapper from '@/components/shared/DashBoardWrapper';
import PageHeader from '@/components/shared/pageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { PlusCircle, Download, DollarSign, TrendingUp, FileText, Target, Activity, HandCoins } from 'lucide-react';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums/routes/routes';
import NewLoan from './components/NewLoan';
import { Dispatch } from 'redux';
import { CREATE_LOAN } from '@/redux/actions/types';
import { CreateLoanPayload, EMISchedule, PaymentRecord } from '@/lib/interfaces';
import { LMS_DASHBOARD_TABS } from '@/lib/enums';
import DashboardCard from './components/DashboardCard';
import MonthlyTargetProgress from './components/MonthlyTargetProgress';
import RecentLoans from './components/RecentLoans';
import { Payments } from './components/Payments';
import Analytics from './components/Analytics';
import AllLoans from './components/AllLoans';
import SelectedLoan from './SelectedLoan';

const LoanManagementSystem: React.FC<{
  handleSearchCustomer: (searchCustomerValue: string) => void;
  loading: boolean;
  dispatch: Dispatch;
  customers: any[];
  fetchAllFiles: () => void;
  allLoansFiles: any;
  loansFileLoading: boolean;
  loansFileError: string | null;
  allLoansStatistics: any;
}> = ({ handleSearchCustomer, loading, dispatch, customers, allLoansFiles, allLoansStatistics }) => {
  const navigate = useNavigate();
  const { activeLoans = 0, totalDisbursed = 0, totalLoans = 0, totalOutstanding = 0 } = allLoansStatistics;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loanTypeFilter, setLoanTypeFilter] = useState('ALL');
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [showCreateLoan, setShowCreateLoan] = useState(false);
  const [_, setShowPaymentModal] = useState(false);
  const [__, setEmiSchedule] = useState<EMISchedule[]>([]);
  const [___, setPaymentRecords] = useState<PaymentRecord[]>([]);

  const onTabChangeHandler = (tab: string) => {
    setActiveTab(tab);
  };

  // When a loan is selected, fetch its EMI schedule and payments (mocked here)
  useEffect(() => {
    if (selectedLoan) {
      // Mock fetching EMI schedule for the selected loan
      setEmiSchedule([
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
      ]);
      // Mock fetching payment records
      setPaymentRecords([
        {
          paymentId: 1,
          paymentNumber: 'PAY-001',
          loanId: selectedLoan.id,
          amount: 21506,
          paymentDate: '2024-02-01',
          paymentMethod: 'BANK_TRANSFER',
          status: 'COMPLETED',
        },
        {
          paymentId: 2,
          paymentNumber: 'PAY-002',
          loanId: selectedLoan.id,
          amount: 21506,
          paymentDate: '2024-03-01',
          paymentMethod: 'BANK_TRANSFER',
          status: 'COMPLETED',
        },
      ]);
    }
  }, [selectedLoan]);

  const filteredLoans = allLoansFiles.filter((loan: any) => {
    const matchesSearch =
      loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.borrowerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || loan.status === statusFilter;
    const matchesType = loanTypeFilter === 'ALL' || loan.loanType === loanTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateLoan = ({ newLoanData }: { newLoanData: CreateLoanPayload }) => {
    if (!newLoanData.fileId || !newLoanData.loanType) {
      return;
    }

    dispatch({ type: CREATE_LOAN, payload: newLoanData });
    setShowCreateLoan(false);
  };
  const viewFileDetailsHandler = (id: string) => {
    navigate({
      pathname: buildOrgRoute(ROUTES.LOAN_MANAGEMENT + ROUTES.FILE_DETAILS + '/' + id),
    });
  };

  const statCards = [
    {
      title: 'Total Loans',
      value: totalLoans,
      icon: FileText,
      color: 'primary',
      change: '+12%',
      description: 'All loans in portfolio',
    },
    {
      title: 'Active Loans',
      value: activeLoans,
      icon: Activity,
      color: 'success',
      change: '+8%',
      description: 'Currently active loans',
    },
    {
      title: 'Total Disbursed',
      value: <I8nCurrencyWrapper value={totalDisbursed} precision={0} />,
      icon: DollarSign,
      color: 'primary',
      change: '+15%',
      description: 'Total amount disbursed',
    },
    {
      title: 'Outstanding Amount',
      value: <I8nCurrencyWrapper value={totalOutstanding} precision={0} />,
      icon: Target,
      color: 'warning',
      change: '-3%',
      description: 'Total outstanding balance',
    },
    {
      title: 'Collections This Month',
      value: <I8nCurrencyWrapper value={0} precision={0} />,
      icon: HandCoins,
      color: 'success',
      change: '+18%',
      description: 'Monthly collections',
    },
    {
      title: 'Portfolio Health',
      value: `${0}%`,
      icon: TrendingUp,
      color: 'primary',
      change: '+2%',
      description: 'Overall portfolio performance',
    },
  ];

  return (
    <DashBoardWrapper>
      <Helmet>
        <title>LOS | Loan Management System</title>
      </Helmet>

      <PageHeader
        title="Loan Management System"
        subtitle="Comprehensive loan portfolio management and tracking"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Loan Management' }]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              <I8nTextWrapper text="export" />
            </Button>
            <Button onClick={() => setShowCreateLoan(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              <I8nTextWrapper text="newLoan" />
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={onTabChangeHandler} className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {LMS_DASHBOARD_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {statCards.map((card, index) => {
              return <DashboardCard index={index} card={card} key={index} />;
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyTargetProgress />
            <RecentLoans allLoansFiles={allLoansFiles} />
          </div>
        </TabsContent>

        <TabsContent value="loans" className="space-y-6">
          <AllLoans
            filteredLoans={filteredLoans}
            loanTypeFilter={loanTypeFilter}
            searchTerm={searchTerm}
            setLoanTypeFilter={setLoanTypeFilter}
            setSearchTerm={setSearchTerm}
            setSelectedLoan={setSelectedLoan}
            setShowPaymentModal={setShowPaymentModal}
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
            viewFileDetailsHandler={viewFileDetailsHandler}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Payments />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Analytics />
        </TabsContent>
      </Tabs>

      <NewLoan
        handleSearchCustomer={handleSearchCustomer}
        loading={loading}
        dispatch={dispatch}
        customers={customers}
        setShowCreateLoan={setShowCreateLoan}
        handleCreateLoan={handleCreateLoan}
        showCreateLoan={showCreateLoan}
      />
      {selectedLoan && <SelectedLoan selectedLoan={selectedLoan} setSelectedLoan={setSelectedLoan} />}
    </DashBoardWrapper>
  );
};

export default LoanManagementSystem;
