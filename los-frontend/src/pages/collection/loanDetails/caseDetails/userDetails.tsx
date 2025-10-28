/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from '@/helpers/dateFormater';
import {
  Calendar,
  CreditCard,
  Target,
  Clock,
  User,
  X,
  FileText,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { useState } from 'react';

const UserDetails = ({
  loanDetails,
  isOpen,
  setIsOpen,
  filteredFollowUpPayments,
}: {
  loanDetails: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredFollowUpPayments: any;
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getDateStatus = (date: string) => {
    if (!date) return { status: 'unknown', color: 'fg-tertiary', bgColor: 'bg-fg-tertiary/10' };

    const targetDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      return { status: 'overdue', color: 'color-error', bgColor: 'bg-color-error/10', border: 'border-color-error/20' };
    } else if (diffDays <= 7) {
      return {
        status: 'upcoming',
        color: 'color-warning',
        bgColor: 'bg-color-warning/10',
        border: 'border-color-warning/20',
      };
    } else {
      return {
        status: 'future',
        color: 'color-success',
        bgColor: 'bg-color-success/10',
        border: 'border-color-success/20',
      };
    }
  };

  const detailItems = [
    {
      id: 'caseDate',
      label: 'Case Date',
      value: loanDetails.caseDate,
      icon: FileText,
      description: 'When the case was created',
      color: 'primary',
    },
    {
      id: 'lastPayment',
      label: 'Last Payment Date',
      value: loanDetails.lastPaymentDetail,
      icon: CreditCard,
      description: 'Most recent payment received',
      color: 'success',
    },
    {
      id: 'maturityDate',
      label: 'Case Maturity Date',
      value: loanDetails.expiryDate,
      icon: Calendar,
      description: 'Loan completion target date',
      color: 'info',
    },
    {
      id: 'commitmentDate',
      label: 'Commitment Date',
      value: filteredFollowUpPayments[0]?.commit,
      icon: Target,
      description: 'Next promised payment date',
      color: 'warning',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
      case 'success':
        return 'bg-color-success/10 text-color-success border-color-success/20';
      case 'info':
        return 'bg-color-info/10 text-color-info border-color-info/20';
      case 'warning':
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      default:
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
    }
  };

  const getStats = () => {
    const hasLastPayment = !!loanDetails.lastPaymentDetail;
    const hasCommitment = !!filteredFollowUpPayments[0]?.commit;
    const maturityStatus = getDateStatus(loanDetails.expiryDate);
    const commitmentStatus = getDateStatus(filteredFollowUpPayments[0]?.commit);

    return {
      hasLastPayment,
      hasCommitment,
      maturityStatus: maturityStatus.status,
      commitmentStatus: commitmentStatus.status,
    };
  };

  const stats = getStats();

  return (
    <>
      {/* Enhanced Modal */}
      {isOpen && (
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
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Case Details</h2>
                      <p className="text-white/80 text-lg">{loanDetails.customer || 'Customer Information'}</p>
                    </div>
                  </div>
                  <button
                    className="p-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-color-success/10 border border-color-success/20 rounded-lg p-3 text-center">
                    <CheckCircle className="w-5 h-5 text-color-success mx-auto mb-1" />
                    <div className="text-sm font-medium text-color-success">
                      {stats.hasLastPayment ? 'Paid' : 'No Payment'}
                    </div>
                  </div>
                  <div className="bg-color-warning/10 border border-color-warning/20 rounded-lg p-3 text-center">
                    <Target className="w-5 h-5 text-color-warning mx-auto mb-1" />
                    <div className="text-sm font-medium text-color-warning">
                      {stats.hasCommitment ? 'Committed' : 'No Promise'}
                    </div>
                  </div>
                  <div
                    className={`${
                      stats.maturityStatus === 'overdue'
                        ? 'bg-color-error/10 border-color-error/20'
                        : stats.maturityStatus === 'upcoming'
                          ? 'bg-color-warning/10 border-color-warning/20'
                          : 'bg-color-success/10 border-color-success/20'
                    } border rounded-lg p-3 text-center`}
                  >
                    <Calendar
                      className={`w-5 h-5 mx-auto mb-1 ${
                        stats.maturityStatus === 'overdue'
                          ? 'text-color-error'
                          : stats.maturityStatus === 'upcoming'
                            ? 'text-color-warning'
                            : 'text-color-success'
                      }`}
                    />
                    <div
                      className={`text-sm font-medium ${
                        stats.maturityStatus === 'overdue'
                          ? 'text-color-error'
                          : stats.maturityStatus === 'upcoming'
                            ? 'text-color-warning'
                            : 'text-color-success'
                      }`}
                    >
                      {stats.maturityStatus === 'overdue'
                        ? 'Overdue'
                        : stats.maturityStatus === 'upcoming'
                          ? 'Due Soon'
                          : 'On Track'}
                    </div>
                  </div>
                  <div className="bg-color-info/10 border border-color-info/20 rounded-lg p-3 text-center">
                    <Activity className="w-5 h-5 text-color-info mx-auto mb-1" />
                    <div className="text-sm font-medium text-color-info">Active</div>
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="grid gap-4">
                  {detailItems.map((item) => {
                    const IconComponent = item.icon;
                    const dateStatus = getDateStatus(item.value);
                    const formattedDate = formatDate(item.value);

                    return (
                      <div
                        key={item.id}
                        className={`relative group p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                          item.id === 'maturityDate' || item.id === 'commitmentDate'
                            ? `${dateStatus.bgColor} ${dateStatus.border}`
                            : getColorClasses(item.color).replace('text-color', 'bg-color').replace('/10', '/5') +
                              ' border-' +
                              item.color +
                              '/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg border ${getColorClasses(item.color)}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-fg-primary">{item.label}</p>
                              <p className="text-xs text-fg-secondary">{item.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-fg-primary">{formattedDate || 'Not set'}</p>
                            {(item.id === 'maturityDate' || item.id === 'commitmentDate') && formattedDate && (
                              <div className="flex items-center gap-1 justify-end mt-1">
                                {dateStatus.status === 'overdue' && (
                                  <>
                                    <AlertTriangle className="w-3 h-3 text-color-error" />
                                    <span className="text-xs text-color-error font-medium">Overdue</span>
                                  </>
                                )}
                                {dateStatus.status === 'upcoming' && (
                                  <>
                                    <Clock className="w-3 h-3 text-color-warning" />
                                    <span className="text-xs text-color-warning font-medium">Due Soon</span>
                                  </>
                                )}
                                {dateStatus.status === 'future' && (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-color-success" />
                                    <span className="text-xs text-color-success font-medium">On Track</span>
                                  </>
                                )}
                              </div>
                            )}
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

      {/* Gradient Overlay */}
      <div className="relative z-10 p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-color-success/10 border border-color-success/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-color-success" />
              <span className="text-sm font-medium text-color-success">
                {stats.hasLastPayment ? 'Payment Received' : 'No Payment Yet'}
              </span>
            </div>
          </div>
          <div className="bg-color-warning/10 border border-color-warning/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-color-warning" />
              <span className="text-sm font-medium text-color-warning">
                {stats.hasCommitment ? 'Promise Made' : 'No Promise'}
              </span>
            </div>
          </div>
        </div>

        {/* Detail Cards */}
        <div className="space-y-3">
          {detailItems.map((item) => {
            const IconComponent = item.icon;
            const dateStatus = getDateStatus(item.value);
            const formattedDate = formatDate(item.value);

            return (
              <div
                key={item.id}
                className={`group p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                  item.id === 'maturityDate' || item.id === 'commitmentDate'
                    ? `${dateStatus.bgColor} ${dateStatus.border} hover:scale-[1.01]`
                    : `${getColorClasses(item.color).replace('/10', '/5')} hover:scale-[1.01]`
                }`}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-md border transition-transform ${
                        hoveredCard === item.id ? 'scale-110' : ''
                      } ${getColorClasses(item.color)}`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-fg-primary">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-fg-primary">{formattedDate || 'Not set'}</span>
                    {(item.id === 'maturityDate' || item.id === 'commitmentDate') && formattedDate && (
                      <div className="flex items-center">
                        {dateStatus.status === 'overdue' && <AlertTriangle className="w-3 h-3 text-color-error" />}
                        {dateStatus.status === 'upcoming' && <Clock className="w-3 h-3 text-color-warning" />}
                        {dateStatus.status === 'future' && <CheckCircle className="w-3 h-3 text-color-success" />}
                      </div>
                    )}
                    <ArrowUpRight
                      className={`w-3 h-3 text-fg-tertiary transition-transform ${
                        hoveredCard === item.id ? 'scale-110 translate-x-0.5 -translate-y-0.5' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UserDetails;
