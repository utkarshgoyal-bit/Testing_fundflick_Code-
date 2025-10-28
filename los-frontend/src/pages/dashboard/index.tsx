import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';

import PageHeader from '@/components/shared/pageHeader';
import TaskTable from '../task/taskManager/taskTable';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/enums';
import { DASHBOARD, FETCH_TASKS_DATA } from '@/redux/actions/types';
import { resetStepperForm } from '@/redux/slices/files';
import { RootState } from '@/redux/store';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';
import I8nTextWrapper from '@/translations/i8nTextWrapper';

import {
  HandCoins,
  Plus,
  Building2,
  User,
  UserRound,
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  Settings,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Activity,
  BarChart3,
  Filter,
} from 'lucide-react';
import { buildOrgRoute } from '@/helpers/routeHelper';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activePage } = useSelector((state: RootState) => state.tasks);
  const { data: dashboardData } = useSelector((state: RootState) => state.dashboard);
  const [timeFilter, setTimeFilter] = useState('today');

  useEffect(() => {
    dispatch({ type: DASHBOARD });
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

  const statCards = [
    {
      label: <I8nTextWrapper text="totalCustomers" />,
      icon: UserRound,
      value: dashboardData?.customerFileCount || 0,
      change: '+12%',
      trend: 'up',
      color: 'primary',
      description: 'Active customer files',
      onClick: () => navigate(buildOrgRoute(`${ROUTES.CUSTOMER_FILE_MANAGEMENT}`)),
    },
    {
      label: <I8nTextWrapper text="totalEmployees" />,
      icon: User,
      value: dashboardData?.employeeCount || 0,
      subValue: `${dashboardData?.inactiveEmployees || 0} inactive`,
      change: '+3%',
      trend: 'up',
      color: 'secondary',
      description: 'Total staff members',
      onClick: () => navigate(buildOrgRoute(`${ROUTES.EMPLOYEE_MANAGEMENT}`)),
    },
    {
      label: <I8nTextWrapper text="totalBranches" />,
      icon: Building2,
      value: dashboardData?.branchCount || 0,
      change: '0%',
      trend: 'neutral',
      color: 'accent',
      description: 'Operating locations',
      onClick: () => navigate(buildOrgRoute(`${ROUTES.BRANCH_MANAGEMENT}`)),
    },
    {
      label: <I8nTextWrapper text="totalPromises" />,
      icon: HandCoins,
      value: dashboardData?.todaysPromises?.total || 0,
      change: '+8%',
      trend: 'up',
      color: 'success',
      description: "Today's commitments",
      onClick: () => navigate(buildOrgRoute(`${ROUTES.DAILY_VIEW}?type=commit`)),
    },
    {
      label: <I8nTextWrapper text="totalCollections" />,
      icon: IndianRupee,
      value: <I8nCurrencyWrapper value={dashboardData?.todaysCollection?.total || 0} precision={2} />,
      change: '+15%',
      trend: 'up',
      color: 'success',
      description: "Today's collections",
      onClick: () => navigate(buildOrgRoute(`${ROUTES.DAILY_VIEW}?type=collection`)),
    },
    {
      label: <I8nTextWrapper text="totalUsers" />,
      icon: Users,
      value: dashboardData?.userCount || 0,
      subValue: `${dashboardData?.inactiveUsers || 0} inactive`,
      change: '+5%',
      trend: 'up',
      color: 'primary',
      description: 'System users',
      onClick: () => navigate(buildOrgRoute(`${ROUTES.USER_MANAGEMENT}`)),
    },
    {
      label: <I8nTextWrapper text="totalDueCases" />,
      icon: AlertCircle,
      value: dashboardData?.todaysCollection?.total || 0,
      change: '-2%',
      trend: 'down',
      color: 'warning',
      description: 'Cases requiring attention',
      onClick: () => navigate(buildOrgRoute(ROUTES.COLLECTION)),
    },
    {
      label: 'Performance',
      icon: Activity,
      value: '94%',
      change: '+1%',
      trend: 'up',
      color: 'primary',
      description: 'Overall efficiency',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
      case 'secondary':
        return 'bg-color-secondary/10 text-color-secondary border-color-secondary/20';
      case 'accent':
        return 'bg-color-accent/10 text-color-accent border-color-accent/20';
      case 'success':
        return 'bg-color-success/10 text-color-success border-color-success/20';
      case 'warning':
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      default:
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-color-success" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-color-error" />;
    return <span className="h-3 w-3 block bg-fg-tertiary rounded-full" />;
  };

  return (
    <>
      <Helmet>
        <title>LOS | Dashboard</title>
      </Helmet>

      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back! Here's what's happening today, ${moment().format('MMMM Do')}`}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-fg-tertiary" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="text-sm bg-color-surface border border-fg-border rounded-lg px-3 py-1.5 text-fg-primary focus:border-color-primary/50"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <Link
              to={buildOrgRoute(ROUTES.CUSTOMER_FILE_MANAGEMENT_REGISTER)}
              onClick={() => dispatch(resetStepperForm())}
            >
              <Button className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                <Plus className="h-4 w-4 mr-2" />
                <I8nTextWrapper text="newCustomers" />
              </Button>
            </Link>
          </div>
        }
      />

      {/* Enhanced Stats Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={`group relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 hover:shadow-lg transition-all duration-300 overflow-hidden ${
                card.onClick ? 'cursor-pointer hover:border-color-primary/30' : ''
              }`}
              onClick={card.onClick}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-3">
                <div
                  className={`absolute top-0 right-0 w-16 h-16 ${
                    card.color === 'primary'
                      ? 'bg-color-primary'
                      : card.color === 'secondary'
                        ? 'bg-color-secondary'
                        : card.color === 'accent'
                          ? 'bg-color-accent'
                          : card.color === 'success'
                            ? 'bg-color-success'
                            : card.color === 'warning'
                              ? 'bg-color-warning'
                              : 'bg-color-primary'
                  } rounded-full -translate-y-8 translate-x-8`}
                ></div>
                <div
                  className={`absolute bottom-0 left-0 w-12 h-12 ${
                    card.color === 'primary'
                      ? 'bg-color-secondary'
                      : card.color === 'secondary'
                        ? 'bg-color-accent'
                        : card.color === 'accent'
                          ? 'bg-color-primary'
                          : card.color === 'success'
                            ? 'bg-color-primary'
                            : card.color === 'warning'
                              ? 'bg-color-secondary'
                              : 'bg-color-secondary'
                  } rounded-full translate-y-6 -translate-x-6`}
                ></div>
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
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  card.color === 'primary'
                    ? 'from-color-primary/3 via-transparent to-color-secondary/3'
                    : card.color === 'secondary'
                      ? 'from-color-secondary/3 via-transparent to-color-accent/3'
                      : card.color === 'accent'
                        ? 'from-color-accent/3 via-transparent to-color-primary/3'
                        : card.color === 'success'
                          ? 'from-color-success/3 via-transparent to-color-primary/3'
                          : card.color === 'warning'
                            ? 'from-color-warning/3 via-transparent to-color-secondary/3'
                            : 'from-color-primary/3 via-transparent to-color-secondary/3'
                }`}
              ></div>

              {/* Card Header */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className={`p-2 rounded-lg border ${getColorClasses(card.color)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                {card.onClick && (
                  <ArrowUpRight className="h-3 w-3 text-fg-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-fg-tertiary truncate">{card.label}</span>
                  {getTrendIcon(card.trend)}
                </div>
                <div className="text-xl font-bold text-fg-primary mb-1 leading-tight">{card.value}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-secondary truncate pr-1">{card.description}</span>
                  <span
                    className={`font-medium whitespace-nowrap ${
                      card.trend === 'up'
                        ? 'text-color-success'
                        : card.trend === 'down'
                          ? 'text-color-error'
                          : 'text-fg-tertiary'
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
                {card.subValue && <div className="text-xs text-color-warning mt-1 truncate">{card.subValue}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Quick Stats */}
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-5 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-14 h-14 bg-color-primary rounded-full -translate-y-7 translate-x-7"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 bg-color-secondary rounded-full translate-y-5 -translate-x-5"></div>
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-color-primary/10 rounded-lg border border-color-primary/20">
                <BarChart3 className="h-5 w-5 text-color-primary" />
              </div>
              <h3 className="font-semibold text-fg-primary">Quick Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Pending Tasks</span>
                <span className="font-medium text-fg-primary">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Completed Today</span>
                <span className="font-medium text-color-success">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Overdue</span>
                <span className="font-medium text-color-error">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-5 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-14 h-14 bg-color-secondary rounded-full -translate-y-7 translate-x-7"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 bg-color-accent rounded-full translate-y-5 -translate-x-5"></div>
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-color-secondary/10 rounded-lg border border-color-secondary/20">
                <Clock className="h-5 w-5 text-color-secondary" />
              </div>
              <h3 className="font-semibold text-fg-primary">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-color-success rounded-full"></div>
                <span className="text-sm text-fg-secondary">Customer file created</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-color-primary rounded-full"></div>
                <span className="text-sm text-fg-secondary">Task assigned</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-color-warning rounded-full"></div>
                <span className="text-sm text-fg-secondary">Payment received</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-5 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-14 h-14 bg-color-accent rounded-full -translate-y-7 translate-x-7"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 bg-color-primary rounded-full translate-y-5 -translate-x-5"></div>
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-color-accent/10 rounded-lg border border-color-accent/20">
                <Target className="h-5 w-5 text-color-accent" />
              </div>
              <h3 className="font-semibold text-fg-primary">This Month</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Target</span>
                <span className="font-medium text-fg-primary">₹50,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Achieved</span>
                <span className="font-medium text-color-success">₹47,200</span>
              </div>
              <div className="w-full bg-color-surface-muted rounded-full h-2">
                <div className="bg-color-success h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Task Section */}
      <div className="bg-color-surface border border-fg-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-fg-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-color-primary/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-color-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-fg-primary">My Tasks</h2>
              <p className="text-sm text-fg-secondary">Manage your assigned tasks</p>
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
    </>
  );
};

export default Dashboard;
