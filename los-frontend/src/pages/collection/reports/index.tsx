import { useEffect } from 'react';
import { CaseCountReport } from './charts/caseCountReport';
import { CollectionReportChart } from './charts/collectionReport';
import FollowupReportChart from './charts/followupsReport';
import { useDispatch, useSelector } from 'react-redux';
import { COLLECTION_DASHBOARD_REPORT } from '@/redux/actions/types';
import Card from './card';
import { RootState } from '@/redux/slices';
import { CURRENCY_SYMBOLS } from '@/lib/enums';
import { StageCaseCountReport } from './charts/caseStagesCountReport';
import { LoanTypeCaseCountReport } from './charts/caseLoanTypeCountReport';
import PageHeader from '@/components/shared/pageHeader';
import { 
  DollarSign, 
  Coins, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

function Reports() {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.collectionDashboardReport);
  useEffect(() => {
    dispatch({ type: COLLECTION_DASHBOARD_REPORT });
  }, []);
  return (
    <div>
      <PageHeader title="reports" />
      <div className="flex  gap-5 my-3 max-md:flex-wrap">
        <div className="w-1/4 space-y-3">
          <Card
            title="Total Amount Due"
            desc={`${CURRENCY_SYMBOLS['INR']}${Intl.NumberFormat('en-IN').format(data?.statesData?.totalAmountDue || 0)}`}
            icon={DollarSign}
          />
          <Card
            title="Total Collections Amount"
            desc={`${CURRENCY_SYMBOLS['INR']}${Intl.NumberFormat('en-IN').format(data?.statesData?.totalCollections || 0)}`}
            icon={Coins}
          />
          <Card
            title="PTP Amount"
            desc={
              CURRENCY_SYMBOLS['INR'] + Intl.NumberFormat('en-IN').format(data?.stageWiseReportData?.ptpAmount || 0)
            }
            icon={Calendar}
          />
          <Card
            title="Broken PTP Amount"
            desc={
              CURRENCY_SYMBOLS['INR'] +
              Intl.NumberFormat('en-IN').format(data?.stageWiseReportData?.brokenPTPAmount || 0)
            }
            icon={AlertTriangle}
          />
        </div>
        <div className="w-full">
          <CollectionReportChart />
        </div>
        <div className="w-1/4 space-y-3">
          <Card title="Pending Cases" desc={data?.statesData?.pendingCases || 0} icon={Clock} />
          <Card title="Cases Resolved" desc={data?.statesData?.resolvedCases || 0} icon={CheckCircle} />
          <Card title="PTP" desc={data?.stageWiseReportData?.totalFutureFollowUps || 0} icon={FileText} />
          <Card title="Broken PTP" desc={data?.stageWiseReportData?.brokenPTPCount || 0} icon={XCircle} />
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-5">
        <CaseCountReport />
        <StageCaseCountReport />
        <LoanTypeCaseCountReport />
        <FollowupReportChart />
      </div>
    </div>
  );
}

export { Reports };
