import {
  CalendarSync,
  AlertCircle,
  CheckCheck,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  Target,
  BarChart3,
  Clock,
} from 'lucide-react';

const Emi = ({ loanDetails }: { loanDetails: any }) => {
  const getColorClasses = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-color-success/10 text-color-success border-color-success/20';
      case 'warning':
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      case 'neutral':
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
      case 'info':
        return 'bg-color-info/10 text-color-info border-color-info/20';
      default:
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
    }
  };

  const calculateDueEmiCount = () => {
    if (loanDetails.emiAmount && loanDetails.dueEmiAmount) {
      return Math.ceil(Number(loanDetails.dueEmiAmount) / Number(loanDetails.emiAmount));
    }
    return 0;
  };

  const charges = [
    {
      id: 'received-emi',
      label: 'Received EMIs',
      value: loanDetails.receivedEmiCount || '0',
      icon: CheckCheck,
      status: 'success',
      description: 'Successfully paid EMIs',
      change: '+12%',
      trend: 'up',
    },
    {
      id: 'due-emi',
      label: 'Due EMIs',
      value: calculateDueEmiCount().toString(),
      icon: CalendarSync,
      status: 'warning',
      description: 'Outstanding EMI payments',
      change: '+8%',
      trend: 'up',
    },
    {
      id: 'remaining-emi',
      label: 'Remaining EMIs',
      value: loanDetails.remainingEmiCount || '0',
      icon: Calendar,
      status: 'neutral',
      description: 'Future EMI payments',
      change: '-5%',
      trend: 'down',
    },
    {
      id: 'tenure',
      label: 'Tenure',
      value: loanDetails.tenure || 'N/A',
      icon: CalendarClock,
      status: 'info',
      description: 'Total loan duration (months)',
      change: '0%',
      trend: 'neutral',
    },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-color-success" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-color-error" />;
    return <span className="h-3 w-3 block bg-fg-tertiary rounded-full" />;
  };

  const calculateCompletionPercentage = () => {
    const received = parseInt(loanDetails.receivedEmiCount || '0');
    const total = received + parseInt(loanDetails.remainingEmiCount || '0') + calculateDueEmiCount();
    return total > 0 ? Math.round((received / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* EMI Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {charges.map((charge) => {
          const IconComponent = charge.icon;

          return (
            <div
              key={charge.id}
              className="group relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl p-4 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-3">
                <div
                  className={`absolute top-0 right-0 w-12 h-12 ${
                    charge.status === 'success'
                      ? 'bg-color-success'
                      : charge.status === 'warning'
                        ? 'bg-color-warning'
                        : charge.status === 'neutral'
                          ? 'bg-color-primary'
                          : charge.status === 'info'
                            ? 'bg-color-info'
                            : 'bg-color-primary'
                  } rounded-full -translate-y-6 translate-x-6`}
                ></div>
              </div>

              {/* Grid Pattern */}
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
                  charge.status === 'success'
                    ? 'from-color-success/3 via-transparent to-color-success/3'
                    : charge.status === 'warning'
                      ? 'from-color-warning/3 via-transparent to-color-warning/3'
                      : charge.status === 'neutral'
                        ? 'from-color-primary/3 via-transparent to-color-primary/3'
                        : charge.status === 'info'
                          ? 'from-color-info/3 via-transparent to-color-info/3'
                          : 'from-color-primary/3 via-transparent to-color-primary/3'
                }`}
              ></div>

              {/* Card Header */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className={`p-2 rounded-lg border ${getColorClasses(charge.status)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-3 w-3 text-fg-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-fg-tertiary truncate">{charge.label}</span>
                  {getTrendIcon(charge.trend)}
                </div>
                <div className="text-xl font-bold text-fg-primary mb-1 leading-tight">{charge.value}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-secondary truncate pr-1">{charge.description}</span>
                  <span
                    className={`font-medium whitespace-nowrap ${
                      charge.trend === 'up' && charge.status === 'success'
                        ? 'text-color-success'
                        : charge.trend === 'up' && charge.status === 'warning'
                          ? 'text-color-warning'
                          : charge.trend === 'down'
                            ? 'text-color-error'
                            : 'text-fg-tertiary'
                    }`}
                  >
                    {charge.change}
                  </span>
                </div>

                {/* Status Messages */}
                {charge.status === 'success' && (
                  <div className="mt-2 p-2 bg-color-success/10 rounded-lg">
                    <span className="text-xs text-color-success font-medium">On track</span>
                  </div>
                )}

                {charge.status === 'warning' && (
                  <div className="flex items-center gap-1 mt-2 p-2 bg-color-warning/10 rounded-lg">
                    <AlertCircle className="h-3 w-3 text-color-warning" />
                    <span className="text-xs text-color-warning font-medium">Needs attention</span>
                  </div>
                )}

                {charge.status === 'info' && (
                  <div className="mt-2 p-2 bg-color-info/10 rounded-lg">
                    <span className="text-xs text-color-info font-medium">Total period</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EMI Progress Summary */}
      <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl p-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 right-0 w-16 h-16 bg-color-success rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-primary rounded-full translate-y-6 -translate-x-6"></div>
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
            backgroundSize: '12px 12px',
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-color-success/3 via-transparent to-color-primary/3"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-color-success/10 rounded-lg border border-color-success/20">
                <Target className="h-5 w-5 text-color-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fg-primary">EMI Progress</h3>
                <p className="text-sm text-fg-secondary">Loan repayment completion status</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-fg-primary">{calculateCompletionPercentage()}%</div>
              <div className="text-xs text-fg-secondary">Completed</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-color-surface-muted rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-color-success to-color-success/80 h-3 rounded-full transition-all duration-500"
              style={{ width: `${calculateCompletionPercentage()}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-color-success">{loanDetails.receivedEmiCount || '0'}</div>
              <div className="text-xs text-fg-secondary">Paid</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-color-warning">{calculateDueEmiCount()}</div>
              <div className="text-xs text-fg-secondary">Due</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-color-primary">{loanDetails.remainingEmiCount || '0'}</div>
              <div className="text-xs text-fg-secondary">Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* EMI Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Timeline */}
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl p-4 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-12 h-12 bg-color-info rounded-full -translate-y-6 translate-x-6"></div>
          </div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
              backgroundSize: '12px 12px',
            }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-color-info/3 via-transparent to-color-info/3"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-color-info/10 rounded-lg border border-color-info/20">
                <Clock className="h-4 w-4 text-color-info" />
              </div>
              <div>
                <h4 className="font-semibold text-fg-primary">Payment Timeline</h4>
                <p className="text-xs text-fg-secondary">EMI schedule overview</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Start Date</span>
                <span className="text-sm font-medium text-fg-primary">{loanDetails.startDate || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">End Date</span>
                <span className="text-sm font-medium text-fg-primary">{loanDetails.endDate || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Next EMI Due</span>
                <span className="text-sm font-medium text-color-warning">{loanDetails.nextEmiDate || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl p-4 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-12 h-12 bg-color-primary rounded-full -translate-y-6 translate-x-6"></div>
          </div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
              backgroundSize: '12px 12px',
            }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-primary/3"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-color-primary/10 rounded-lg border border-color-primary/20">
                <BarChart3 className="h-4 w-4 text-color-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-fg-primary">Performance</h4>
                <p className="text-xs text-fg-secondary">Payment track record</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Payment Rate</span>
                <span className="text-sm font-medium text-color-success">{calculateCompletionPercentage()}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">On-time Payments</span>
                <span className="text-sm font-medium text-fg-primary">{loanDetails.receivedEmiCount || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Delayed Payments</span>
                <span className="text-sm font-medium text-color-error">{calculateDueEmiCount()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emi;
