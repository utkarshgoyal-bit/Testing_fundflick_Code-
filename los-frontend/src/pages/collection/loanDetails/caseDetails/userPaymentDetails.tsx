/* eslint-disable @typescript-eslint/no-explicit-any */
import { DollarSign, CreditCard, Building, X, Wallet, Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '@/lib/enums';
import { useState } from 'react';

const UserPaymentDetails = ({
  loanDetails,
  isCaseDetailsOpen,
  setIsCaseDetailsOpen,
  filteredPaymentSlicePayments,
}: {
  loanDetails: any;
  isCaseDetailsOpen: boolean;
  setIsCaseDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredPaymentSlicePayments: any;
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getPaymentStatus = () => {
    const lastPayment = filteredPaymentSlicePayments[0]?.amount;
    const emiAmount = loanDetails.emiAmount;

    if (!lastPayment) return { status: 'none', color: 'error', message: 'No payment record' };
    if (lastPayment >= emiAmount) return { status: 'full', color: 'success', message: 'Full payment received' };
    if (lastPayment < emiAmount) return { status: 'partial', color: 'warning', message: 'Partial payment received' };
    return { status: 'unknown', color: 'info', message: 'Payment status unknown' };
  };

  const paymentStatus = getPaymentStatus();

  const paymentDetails = [
    {
      id: 'emiAmount',
      label: 'EMI Amount',
      value: `${CURRENCY_SYMBOLS['INR']} ${loanDetails.emiAmount || '0'}`,
      icon: DollarSign,
      description: 'Monthly installment amount',
      color: 'primary',
      trend: '+0%',
      isAmount: true,
    },
    {
      id: 'lastPayment',
      label: 'Last Payment',
      value: filteredPaymentSlicePayments[0]?.amount
        ? `${CURRENCY_SYMBOLS['INR']} ${filteredPaymentSlicePayments[0]?.amount}`
        : 'N/A',
      icon: CreditCard,
      description: 'Most recent payment received',
      color: paymentStatus.color,
      trend: paymentStatus.status === 'full' ? '+100%' : paymentStatus.status === 'partial' ? '+50%' : '0%',
      isAmount: true,
    },
    {
      id: 'loanAmount',
      label: 'Loan Amount',
      value: `${CURRENCY_SYMBOLS['INR']} ${loanDetails.financeAmount || '0'}`,
      icon: Building,
      description: 'Total loan principal amount',
      color: 'info',
      trend: '+0%',
      isAmount: true,
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
      case 'success':
        return 'bg-color-success/10 text-color-success border-color-success/20';
      case 'error':
        return 'bg-color-error/10 text-color-error border-color-error/20';
      case 'warning':
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      case 'info':
        return 'bg-color-info/10 text-color-info border-color-info/20';
      default:
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'full':
        return <CheckCircle className="w-4 h-4 text-color-success" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-color-warning" />;
      case 'none':
        return <X className="w-4 h-4 text-color-error" />;
      default:
        return <Clock className="w-4 h-4 text-color-info" />;
    }
  };

  return (
    <>
      {/* Enhanced Modal */}
      {isCaseDetailsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted w-full max-w-3xl rounded-xl shadow-2xl border border-fg-border overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-24 h-24 bg-color-primary rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-color-secondary rounded-full translate-y-10 -translate-x-10"></div>
            </div>

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                backgroundSize: '12px 12px',
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-secondary/3"></div>

            <div className="relative z-10">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-color-primary to-color-primary-light p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Payment Overview</h2>
                      <p className="text-white/80 text-lg">{loanDetails.customer || 'Customer Payment Details'}</p>
                    </div>
                  </div>
                  <button
                    className="p-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all"
                    onClick={() => setIsCaseDetailsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Customer Info */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-color-surface-muted rounded-lg border border-fg-border">
                  <div className="w-12 h-12 bg-color-primary/10 rounded-full flex items-center justify-center border border-color-primary/20">
                    <span className="text-color-primary font-bold text-lg">
                      {loanDetails.customer?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-fg-primary text-lg">
                      {loanDetails.customer || 'Unknown Customer'}
                    </h3>
                    <p className="text-sm text-fg-secondary">Loan Account Holder</p>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mb-6 p-4 rounded-lg border bg-gradient-to-r from-color-surface to-color-surface-muted">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(paymentStatus.status)}
                    <h4 className="font-semibold text-fg-primary">Payment Status</h4>
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      paymentStatus.color === 'success'
                        ? 'text-color-success'
                        : paymentStatus.color === 'warning'
                          ? 'text-color-warning'
                          : paymentStatus.color === 'error'
                            ? 'text-color-error'
                            : 'text-color-info'
                    }`}
                  >
                    {paymentStatus.message}
                  </p>
                </div>

                {/* Detailed Payment Information */}
                <div className="grid gap-4">
                  <h4 className="font-semibold text-fg-primary mb-2">Payment Details</h4>
                  {paymentDetails.map((detail) => {
                    const IconComponent = detail.icon;

                    return (
                      <div
                        key={detail.id}
                        className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getColorClasses(
                          detail.color
                        )
                          .replace('text-color', 'bg-color')
                          .replace('/10', '/5')}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg border ${getColorClasses(detail.color)}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-fg-primary">{detail.label}</p>
                              <p className="text-xs text-fg-secondary">{detail.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-fg-primary text-lg">{detail.value}</p>
                            <p
                              className={`text-xs font-medium ${
                                detail.trend.includes('+') && detail.trend !== '+0%'
                                  ? 'text-color-success'
                                  : detail.trend.includes('-')
                                    ? 'text-color-error'
                                    : 'text-fg-tertiary'
                              }`}
                            >
                              {detail.trend}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`mb-6 p-3 rounded-lg border flex items-center gap-2 ${
          paymentStatus.color === 'success'
            ? 'bg-color-success/10 border-color-success/20'
            : paymentStatus.color === 'warning'
              ? 'bg-color-warning/10 border-color-warning/20'
              : paymentStatus.color === 'error'
                ? 'bg-color-error/10 border-color-error/20'
                : 'bg-color-info/10 border-color-info/20'
        }`}
      >
        {getStatusIcon(paymentStatus.status)}
        <span
          className={`text-sm font-medium ${
            paymentStatus.color === 'success'
              ? 'text-color-success'
              : paymentStatus.color === 'warning'
                ? 'text-color-warning'
                : paymentStatus.color === 'error'
                  ? 'text-color-error'
                  : 'text-color-info'
          }`}
        >
          {paymentStatus.message}
        </span>
      </div>

      {/* Payment Details Cards */}
      <div className="flex-1 space-y-4">
        {paymentDetails.map((detail) => {
          const IconComponent = detail.icon;

          return (
            <div
              key={detail.id}
              className={`group p-4 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${getColorClasses(
                detail.color
              ).replace('/10', '/5')} hover:scale-[1.02]`}
              onMouseEnter={() => setHoveredCard(detail.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg border transition-transform ${
                      hoveredCard === detail.id ? 'scale-110' : ''
                    } ${getColorClasses(detail.color)}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-fg-primary">{detail.label}</p>
                    <p className="text-xs text-fg-secondary">{detail.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-fg-primary">{detail.value}</p>
                  <p
                    className={`text-xs font-medium ${
                      detail.trend.includes('+') && detail.trend !== '+0%'
                        ? 'text-color-success'
                        : detail.trend.includes('-')
                          ? 'text-color-error'
                          : 'text-fg-tertiary'
                    }`}
                  >
                    {detail.trend}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-fg-border">
        <div className="flex items-center gap-2 text-sm text-fg-secondary">
          <Activity className="w-4 h-4" />
          <span>Payment tracking active</span>
        </div>
      </div>
    </>
  );
};

export default UserPaymentDetails;
