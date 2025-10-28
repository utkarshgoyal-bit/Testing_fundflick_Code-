import PageHeader from '@/components/shared/pageHeader';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/lib/enums';
import { cn, multiSelectStyle } from '@/lib/utils';
import TaskTable from '@/pages/task/taskManager/taskTable';
import { COLLECTION_DASHBOARD, FETCH_BRANCHES_DATA, FETCH_TASKS_DATA } from '@/redux/actions/types';
import { setFilter } from '@/redux/slices/collection/collectionDashboard';
import { RootState } from '@/redux/store';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { ArrowUpRight, BarChart3, CheckCircle, IndianRupee, RefreshCw, Settings } from 'lucide-react';
import Multiselect from 'multiselect-react-dropdown';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { default as CollationEfficiencyAmount } from './cards/collectionEfficiencyAmount';
import CollationEfficiencyCase from './cards/collectionEfficiencyCase';
import FollowupEfficiencyCase from './cards/followupEfficiencyCase';
import Followups from './FollowUps/followups';
import Payments from './Payments/Payments';
import { buildOrgRoute } from '@/helpers/routeHelper';

export default function CollectionDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = new URLSearchParams();
  const { data: dashboardData, filters } = useSelector((state: RootState) => state.collectionDashboard);
  const {
    tableConfiguration: { data: branchesData },
  } = useSelector((state: RootState) => state.branch);
  const { activePage } = useSelector((state: RootState) => state.tasks);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onCollectionFilterChangeHandler = ({ day, branch }: { day?: string; branch?: string }) => {
    dispatch(setFilter({ ...filters, collectionDay: day, branch }));
    onFetchCollections();
  };

  const onFollowUpFilterChangeHandler = ({ day }: { day: string }) => {
    dispatch(setFilter({ ...filters, followupDay: day }));
    onFetchCollections();
  };

  const onFetchCollections = useCallback(() => {
    dispatch({ type: COLLECTION_DASHBOARD });
    dispatch({ type: FETCH_BRANCHES_DATA });
    dispatch({
      type: FETCH_TASKS_DATA,
      payload: {
        filter: {
          activeFilter: 'assignedToMe',
        },
        silent: true,
      },
    });
  }, [dispatch, activePage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onFetchCollections();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    onFetchCollections();
    navigate(buildOrgRoute(`${ROUTES.COLLECTION_DASHBOARD}?${params.toString()}`));
  }, [onFetchCollections]);

  useEffect(() => {
    params.set('collectionDay', filters.collectionDay || 'today');
    params.set('p2pDate', filters.followupDay || 'today');
    navigate(buildOrgRoute(`${ROUTES.COLLECTION_DASHBOARD}?${params.toString()}`));
  }, [filters]);
  return (
    <>
      <Helmet>
        <title>LOS | Collection Dashboard</title>
      </Helmet>

      {/* Enhanced Header */}
      <PageHeader title="Collection Dashboard" subtitle="Monitor collection performance and track payments" />
      <div className="w-full flex justify-end items-center my-3">
        <Multiselect
          options={branchesData.map((branch: any) => branch.name)}
          isObject={false}
          showCheckbox={true}
          closeOnSelect={false}
          avoidHighlightFirstOption
          onSelect={(value) => onCollectionFilterChangeHandler({ branch: value })}
          onRemove={(value) => onCollectionFilterChangeHandler({ branch: value })}
          placeholder={'Select Branch to filter'}
          selectedValues={filters.branch}
          style={{
            ...multiSelectStyle,
            searchBox: {
              borderRadius: 'calc(var(--radius) - 2px)',
              alignItems: 'center',
              display: 'flex',
              border: '1px solid var(--fg-border)',
              height: '2.5rem',
              maxWidth: '14rem',
              minWidth: '14rem',
              overflow: 'auto',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--fg-primary)',
            },
            chips: {
              background: 'var(--color-primary)',
              margin: 0,
              padding: '0.2rem 1rem',
              color: 'var(--fg-on-accent)',
            },
          }}
        />
        <div className="flex items-center gap-3">
          <div className="relative"></div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="border-fg-border hover:bg-color-surface-muted"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Link to={buildOrgRoute(ROUTES.COLLECTION_REPORTS)} className={cn(buttonVariants({ variant: 'default' }))}>
            <BarChart3 className="h-4 w-4 mr-2" />
            <I8nTextWrapper text="reports" />
          </Link>
        </div>
      </div>

      {/* Enhanced Collection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        <div className="group relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-color-primary/30">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            {/* <div className="absolute top-0 right-0 w-16 h-16 bg-color-primary rounded-full -translate-y-8 translate-x-8"></div> */}
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-secondary rounded-full translate-y-6 -translate-x-6"></div>
          </div>

          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
              backgroundSize: '12px 12px',
            }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-secondary/3"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-color-primary/10 rounded-lg border border-color-primary/20">
                  <IndianRupee className="h-5 w-5 text-color-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-fg-primary">Collection Efficiency</h3>
                  <p className="text-sm text-fg-secondary">Amount-based metrics</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-fg-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="bg-color-surface-muted/30 rounded-lg p-4">
              <CollationEfficiencyAmount chartData={dashboardData?.CollectionEfficiencyAmount} />
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-color-secondary/30">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            {/* <div className="absolute top-0 right-0 w-16 h-16 bg-color-secondary rounded-full -translate-y-8 translate-x-8"></div> */}
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-accent rounded-full translate-y-6 -translate-x-6"></div>
          </div>

          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
              backgroundSize: '12px 12px',
            }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-color-secondary/3 via-transparent to-color-accent/3"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-color-secondary/10 rounded-lg border border-color-secondary/20">
                  <BarChart3 className="h-5 w-5 text-color-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-fg-primary">Case Efficiency</h3>
                  <p className="text-sm text-fg-secondary">Case-wise analysis</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-fg-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="bg-color-surface-muted/30 rounded-lg p-4">
              <CollationEfficiencyCase chartData={dashboardData?.CollectionEfficiencyCaseWise} />
            </div>
          </div>
        </div>

        {dashboardData && dashboardData?.FollowupEfficiencyCase && (
          <div className="group relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-color-accent/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              {/* <div className="absolute top-0 right-0 w-16 h-16 bg-color-accent rounded-full -translate-y-8 translate-x-8"></div> */}
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-primary rounded-full translate-y-6 -translate-x-6"></div>
            </div>

            {/* Subtle Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                backgroundSize: '12px 12px',
              }}
            ></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-color-accent/3 via-transparent to-color-primary/3"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-color-accent/10 rounded-lg border border-color-accent/20">
                    <CheckCircle className="h-5 w-5 text-color-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-fg-primary">Follow-up Status</h3>
                    <p className="text-sm text-fg-secondary">Tracking progress</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-fg-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="bg-color-surface-muted/30 rounded-lg p-4">
                <FollowupEfficiencyCase
                  chartData={[
                    {
                      totalFollowUps: dashboardData?.FollowupEfficiencyCase[0]?.totalFollowUps,
                      totalUpcoming: dashboardData?.totalUpcomingCollectionFilesCount,
                    },
                  ]}
                  totalCases={dashboardData?.totalCases}
                  totalUpcomingCollectionFilesCount={dashboardData?.totalUpcomingCollectionFilesCount}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Follow-up Report */}

      {/* Enhanced Follow-ups and Payments Section */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            {/* <div className="absolute top-0 right-0 w-20 h-20 bg-color-primary rounded-full -translate-y-10 translate-x-10"></div> */}
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-color-secondary rounded-full translate-y-8 -translate-x-8"></div>
          </div>

          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
              backgroundSize: '12px 12px',
            }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-secondary/3"></div>

          <div className="relative z-10 p-4 space-y-4">
            <div className="bg-color-surface border border-fg-border rounded-lg overflow-hidden">
              <Followups onFollowUpFilterChangeHandler={onFollowUpFilterChangeHandler} />
            </div>
            <div className="bg-color-surface border border-fg-border rounded-lg overflow-hidden">
              <Payments
                data={dashboardData}
                filters={filters}
                onCollectionFilterChangeHandler={onCollectionFilterChangeHandler}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tasks Section */}
      <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          {/* <div className="absolute top-0 right-0 w-16 h-16 bg-color-primary rounded-full -translate-y-8 translate-x-8"></div> */}
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-secondary rounded-full translate-y-6 -translate-x-6"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
            backgroundSize: '12px 12px',
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-secondary/3"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between p-6 border-b border-fg-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-color-primary/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-color-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-fg-primary">My Tasks</h2>
                <p className="text-sm text-fg-secondary">Manage your assigned collection tasks</p>
              </div>
            </div>
            <Link to={buildOrgRoute(ROUTES.TASK_MANAGEMENT)}>
              <Button variant="outline" className="border-fg-border hover:bg-color-surface-muted">
                <Settings className="h-4 w-4 mr-2" />
                <I8nTextWrapper text="Manage Task" />
              </Button>
            </Link>
          </div>
          <div className="p-6">
            <TaskTable />
          </div>
        </div>
      </div>
    </>
  );
}
