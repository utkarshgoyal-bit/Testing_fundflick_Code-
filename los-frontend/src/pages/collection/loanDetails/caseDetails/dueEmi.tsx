import { CURRENCY_SYMBOLS } from '@/lib/enums';
import {
  TrendingUp,
  Plus,
  AlertCircle,
  TrendingDown,
  DollarSign,
  Wallet,
  CreditCard,
  ArrowUpRight,
} from 'lucide-react';

const DueEmi = ({ loanDetails }: { loanDetails: any }) => {
  const getColorClasses = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'bg-color-error/10 text-color-error border-color-error/20';
      case 'warning':
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      case 'neutral':
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
      case 'success':
        return 'bg-color-success/10 text-color-success border-color-success/20';
      default:
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
    }
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'urgent':
  //       return 'color-error';
  //     case 'warning':
  //       return 'color-warning';
  //     case 'neutral':
  //       return 'color-primary';
  //     case 'success':
  //       return 'color-success';
  //     default:
  //       return 'color-primary';
  //   }
  // };

  const charges = [
    {
      id: 'due-amount',
      label: 'Due Amount',
      value: `${CURRENCY_SYMBOLS['INR']}${loanDetails.dueEmiAmount || '0'}`,
      icon: Wallet,
      status: 'urgent',
      description: 'EMI payment due this month',
      change: '+2.5%',
      trend: 'up',
    },
    {
      id: 'bounce-charges',
      label: 'Bounce Charges',
      value: `${CURRENCY_SYMBOLS['INR']}${loanDetails.dueBounceCharge || '0'}`,
      icon: TrendingDown,
      status: 'warning',
      description: 'Additional fees for failed payments',
      change: '+15%',
      trend: 'up',
    },
    {
      id: 'other-charges',
      label: 'Other Charges',
      value: 'N/A',
      icon: CreditCard,
      status: 'neutral',
      description: 'No additional charges applied',
      change: '0%',
      trend: 'neutral',
    },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-color-error" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-color-success" />;
    return <span className="h-3 w-3 block bg-fg-tertiary rounded-full" />;
  };

  const totalOutstanding = () => {
    const dueAmount = parseInt(loanDetails?.dueEmiAmount || '0');
    const bounceCharge = parseInt(loanDetails?.dueBounceCharge || '0');
    return dueAmount + bounceCharge;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    charge.status === 'urgent'
                      ? 'bg-color-error'
                      : charge.status === 'warning'
                        ? 'bg-color-warning'
                        : charge.status === 'neutral'
                          ? 'bg-color-primary'
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
                  charge.status === 'urgent'
                    ? 'from-color-error/3 via-transparent to-color-error/3'
                    : charge.status === 'warning'
                      ? 'from-color-warning/3 via-transparent to-color-warning/3'
                      : charge.status === 'neutral'
                        ? 'from-color-primary/3 via-transparent to-color-primary/3'
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
                      charge.trend === 'up' && charge.status === 'urgent'
                        ? 'text-color-error'
                        : charge.trend === 'up' && charge.status === 'warning'
                          ? 'text-color-warning'
                          : charge.trend === 'down'
                            ? 'text-color-success'
                            : 'text-fg-tertiary'
                    }`}
                  >
                    {charge.change}
                  </span>
                </div>

                {/* Status Messages */}
                {charge.status === 'urgent' && (
                  <div className="flex items-center gap-1 mt-2 p-2 bg-color-error/10 rounded-lg">
                    <AlertCircle className="h-3 w-3 text-color-error" />
                    <span className="text-xs text-color-error font-medium">Payment overdue</span>
                  </div>
                )}

                {charge.status === 'warning' && (
                  <div className="mt-2 p-2 bg-color-warning/10 rounded-lg">
                    <span className="text-xs text-color-warning font-medium">Additional fee applied</span>
                  </div>
                )}

                {charge.status === 'neutral' && (
                  <div className="mt-2 p-2 bg-color-success/10 rounded-lg">
                    <span className="text-xs text-color-success font-medium">No charges applied</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Outstanding Summary */}
      <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl p-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          {/* <div className="absolute top-0 right-0 w-16 h-16 bg-color-primary rounded-full -translate-y-8 translate-x-8"></div> */}
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-secondary rounded-full translate-y-6 -translate-x-6"></div>
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
        <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-secondary/3"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-color-primary/10 rounded-lg border border-color-primary/20">
                <DollarSign className="h-5 w-5 text-color-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fg-primary">Total Outstanding</h3>
                <p className="text-sm text-fg-secondary">Combined due amount and charges</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-fg-primary">
                {CURRENCY_SYMBOLS['INR']}
                {totalOutstanding().toLocaleString()}
              </div>
              <div className="text-xs text-fg-secondary">As of {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Status */}
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
                <AlertCircle className="h-4 w-4 text-color-info" />
              </div>
              <div>
                <h4 className="font-semibold text-fg-primary">Payment Status</h4>
                <p className="text-xs text-fg-secondary">Current payment state</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Status</span>
                <span className="text-sm font-medium text-color-error">Overdue</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Days Past Due</span>
                <span className="text-sm font-medium text-fg-primary">{loanDetails.daysOverdue || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">Last Payment</span>
                <span className="text-sm font-medium text-fg-primary">N/A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl p-4 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-12 h-12 bg-color-success rounded-full -translate-y-6 translate-x-6"></div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-color-success/3 via-transparent to-color-success/3"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-color-success/10 rounded-lg border border-color-success/20">
                <Plus className="h-4 w-4 text-color-success" />
              </div>
              <div>
                <h4 className="font-semibold text-fg-primary">Next Steps</h4>
                <p className="text-xs text-fg-secondary">Recommended actions</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-color-error rounded-full"></div>
                <span className="text-sm text-fg-secondary">Contact customer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-color-warning rounded-full"></div>
                <span className="text-sm text-fg-secondary">Schedule follow-up</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-color-primary rounded-full"></div>
                <span className="text-sm text-fg-secondary">Update case notes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DueEmi;
