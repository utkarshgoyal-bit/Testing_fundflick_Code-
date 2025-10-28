import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState, useCallback } from 'react';
import urlQueryParams from '@/helpers/urlQueryParams';
import PageHeader from '@/components/shared/pageHeader';
import DailyFollowups from './DailyFollowUps';
import DailyPayment from './DailyPayments';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/lib/enums';
import { Helmet } from 'react-helmet';
import { MessageCircle, CreditCard, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FETCH_COLLECTION_PAYMENT_BY_DATE, FETCH_COLLECTION_FOLLOWUP_BY_DATE } from '@/redux/store/actionTypes';

const DailyViews = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const type = urlQueryParams('type');
  const { userId } = useParams();
  const [value, setValue] = useState(type || 'followUps');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { tableConfiguration: { total: totalFollowUps } = {} } = useSelector(
    (state: RootState) => state.FollowUpsliceDetails
  );
  const { tableConfiguration: { total: totalCollections } = {} } = useSelector(
    (state: RootState) => state.collectionPayment
  );

  const setDailyFollowUpsRoutes = useCallback(
    ({ route }: { route: string }) => {
      navigate(buildOrgRoute(ROUTES.COLLECTION + '/daily-views?type=' + route));
    },
    [navigate]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh action
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    dispatch({ type: FETCH_COLLECTION_PAYMENT_BY_DATE });
    dispatch({ type: FETCH_COLLECTION_FOLLOWUP_BY_DATE, payload: { userId } });
    if (type === 'followUps') {
      setValue('followUps');
      setDailyFollowUpsRoutes({ route: 'followUps' });
    } else if (type === 'receipts') {
      setValue('receipts');
      setDailyFollowUpsRoutes({ route: 'receipts' });
    } else {
      setValue('followUps');
      setDailyFollowUpsRoutes({ route: 'followUps' });
    }
  }, [type, setDailyFollowUpsRoutes]);

  const getTabStats = (tabValue: string) => {
    // Mock stats - replace with actual data
    switch (tabValue) {
      case 'followUps':
        return { count: totalFollowUps, label: 'Follow-ups' };
      case 'receipts':
        return { count: totalCollections, label: 'Receipts' };
      default:
        return { count: 0, label: 'Items' };
    }
  };

  return (
    <>
      <Helmet>
        <title>LOS | Daily View</title>
      </Helmet>

      <div className="min-h-screen bg-color-background">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <PageHeader
            title="Daily View"
            subtitle={`Collection activities for ${moment().format('MMMM Do, YYYY')}`}
            navigateTo={buildOrgRoute(ROUTES.COLLECTION)}
            actions={
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="border-fg-border hover:bg-color-surface-muted"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="border-fg-border hover:bg-color-surface-muted"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button> */}
              </div>
            }
          />

          {/* Enhanced Overview Cards */}
          {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
              <div className="absolute inset-0 opacity-3">
                <div className="absolute top-0 right-0 w-12 h-12 bg-color-primary rounded-full -translate-y-6 translate-x-6"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <MessageCircle className="h-5 w-5 text-color-primary" />
                  <span className="text-xs text-fg-tertiary">Today</span>
                </div>
                <div className="text-xl font-bold text-fg-primary">24</div>
                <div className="text-xs text-fg-secondary">Follow-ups</div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
              <div className="absolute inset-0 opacity-3">
                <div className="absolute top-0 right-0 w-12 h-12 bg-color-success rounded-full -translate-y-6 translate-x-6"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="h-5 w-5 text-color-success" />
                  <span className="text-xs text-fg-tertiary">Today</span>
                </div>
                <div className="text-xl font-bold text-fg-primary">18</div>
                <div className="text-xs text-fg-secondary">Receipts</div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
              <div className="absolute inset-0 opacity-3">
                <div className="absolute top-0 right-0 w-12 h-12 bg-color-secondary rounded-full -translate-y-6 translate-x-6"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <IndianRupee className="h-5 w-5 text-color-secondary" />
                  <span className="text-xs text-fg-tertiary">Collected</span>
                </div>
                <div className="text-xl font-bold text-fg-primary">₹2,45,000</div>
                <div className="text-xs text-fg-secondary">Amount</div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
              <div className="absolute inset-0 opacity-3">
                <div className="absolute top-0 right-0 w-12 h-12 bg-color-accent rounded-full -translate-y-6 translate-x-6"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-5 w-5 text-color-accent" />
                  <span className="text-xs text-fg-tertiary">Efficiency</span>
                </div>
                <div className="text-xl font-bold text-fg-primary">87%</div>
                <div className="text-xs text-fg-secondary">Performance</div>
              </div>
            </div>
          </div> */}

          {/* Enhanced Tabs */}
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

            <div className="relative z-10">
              <Tabs value={value} onValueChange={setValue} className="w-full">
                {/* Enhanced Tab Navigation */}
                <div className="border-b border-fg-border p-6 pb-0">
                  <TabsList className="grid w-full grid-cols-2 bg-color-surface-muted/50 border border-fg-border rounded-lg p-1">
                    <TabsTrigger
                      value="followUps"
                      className="data-[state=active]:bg-color-surface data-[state=active]:border data-[state=active]:border-fg-border data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Follow Ups</span>
                        <span className="sm:hidden">Follow</span>
                        <div className="bg-color-primary/10 text-color-primary px-2 py-1 rounded-full text-xs">
                          {getTabStats('followUps').count}
                        </div>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="receipts"
                      className="data-[state=active]:bg-color-surface data-[state=active]:border data-[state=active]:border-fg-border data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="hidden sm:inline">Receipts</span>
                        <span className="sm:hidden">Receipts</span>
                        <div className="bg-color-success/10 text-color-success px-2 py-1 rounded-full text-xs">
                          {getTabStats('receipts').count}
                        </div>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <TabsContent value="followUps" className="m-0">
                  <div className="p-6">
                    <div className="bg-color-surface border border-fg-border rounded-lg overflow-hidden">
                      <div className="border-b border-fg-border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-color-primary/10 rounded-lg">
                              <MessageCircle className="h-5 w-5 text-color-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-fg-primary">Daily Follow-ups</h3>
                              <p className="text-sm text-fg-secondary">Track and manage follow-up activities</p>
                            </div>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-fg-border hover:bg-color-surface-muted"
                            >
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-fg-border hover:bg-color-surface-muted"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div> */}
                        </div>
                      </div>
                      <div className="p-4">
                        <DailyFollowups />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="receipts" className="m-0">
                  <div className="p-6">
                    <div className="bg-color-surface border border-fg-border rounded-lg overflow-hidden">
                      <div className="border-b border-fg-border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-color-success/10 rounded-lg">
                              <CreditCard className="h-5 w-5 text-color-success" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-fg-primary">Daily Receipts</h3>
                              <p className="text-sm text-fg-secondary">Monitor payment collections and receipts</p>
                            </div>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-fg-border hover:bg-color-surface-muted"
                            >
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-fg-border hover:bg-color-surface-muted"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div> */}
                        </div>
                      </div>
                      <div className="p-4">
                        <DailyPayment />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DailyViews;
