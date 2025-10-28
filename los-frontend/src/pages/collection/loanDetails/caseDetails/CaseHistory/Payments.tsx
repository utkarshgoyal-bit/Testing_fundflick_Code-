import { ColumnDef } from '@tanstack/react-table';
import { RTable } from '@/components/shared/table';
import { toFormatDate } from '@/helpers/dateFormater';
import { useState, Fragment } from 'react';
import moment from 'moment';
import {
  DollarSign,
  Calendar,
  User,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Filter,
  Search,
  MessageSquare,
  Receipt,
  Wallet,
  Target,
} from 'lucide-react';

const getPaymentMethodIcon = (paymentMode: string) => {
  const mode = paymentMode?.toLowerCase();
  switch (mode) {
    case 'cash':
      return <Banknote className="w-3 h-3" />;
    case 'card':
    case 'credit card':
    case 'debit card':
      return <CreditCard className="w-3 h-3" />;
    case 'upi':
    case 'digital':
    case 'online':
      return <Smartphone className="w-3 h-3" />;
    case 'bank transfer':
    case 'neft':
    case 'rtgs':
      return <Building className="w-3 h-3" />;
    case 'cheque':
    case 'check':
      return <Receipt className="w-3 h-3" />;
    default:
      return <Wallet className="w-3 h-3" />;
  }
};

const getPaymentMethodBadge = (paymentMode: string) => {
  const mode = paymentMode?.toLowerCase();
  switch (mode) {
    case 'cash':
      return {
        color: 'bg-color-success/10 text-color-success border border-color-success/20',
        icon: getPaymentMethodIcon(paymentMode),
        label: 'Cash',
      };
    case 'card':
    case 'credit card':
    case 'debit card':
      return {
        color: 'bg-color-info/10 text-color-info border border-color-info/20',
        icon: getPaymentMethodIcon(paymentMode),
        label: 'Card',
      };
    case 'upi':
    case 'digital':
    case 'online':
      return {
        color: 'bg-color-primary/10 text-color-primary border border-color-primary/20',
        icon: getPaymentMethodIcon(paymentMode),
        label: 'Digital',
      };
    case 'bank transfer':
    case 'neft':
    case 'rtgs':
      return {
        color: 'bg-color-secondary/10 text-color-secondary border border-color-secondary/20',
        icon: getPaymentMethodIcon(paymentMode),
        label: 'Bank Transfer',
      };
    case 'cheque':
    case 'check':
      return {
        color: 'bg-color-warning/10 text-color-warning border border-color-warning/20',
        icon: getPaymentMethodIcon(paymentMode),
        label: 'Cheque',
      };
    default:
      return {
        color: 'bg-fg-tertiary/10 text-fg-tertiary border border-fg-border',
        icon: getPaymentMethodIcon(paymentMode),
        label: paymentMode || 'Unknown',
      };
  }
};

const getStatusBadge = (updatedAt: string | number | Date, commit: string | number | Date) => {
  const voucherDate = moment(updatedAt);
  const p2pDate = moment(commit);
  const today = moment();

  const isOverdue = voucherDate.isValid() && p2pDate.isValid() && voucherDate.isBefore(today);
  const isOnTime =
    voucherDate.isValid() && p2pDate.isValid() && voucherDate.isSameOrBefore(today) && p2pDate.isSameOrAfter(today);
  const isUpcoming = voucherDate.isValid() && p2pDate.isValid() && p2pDate.isAfter(today);

  if (isOverdue) {
    return {
      color: 'bg-color-error/10 text-color-error border border-color-error/20',
      icon: <XCircle className="w-3 h-3" />,
      label: 'Overdue',
    };
  } else if (isOnTime) {
    return {
      color: 'bg-color-warning/10 text-color-warning border border-color-warning/20',
      icon: <Clock className="w-3 h-3" />,
      label: 'On-time',
    };
  } else if (isUpcoming) {
    return {
      color: 'bg-color-success/10 text-color-success border border-color-success/20',
      icon: <CheckCircle className="w-3 h-3" />,
      label: 'Upcoming',
    };
  } else {
    return {
      color: 'bg-color-success/10 text-color-success border border-color-success/20',
      icon: <CheckCircle className="w-3 h-3" />,
      label: 'Completed',
    };
  }
};

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'createdAtTimeStamp',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <Calendar className="w-4 h-4" />
        Payment Date
      </div>
    ),
    cell: (props: { row: { original: { createdAtTimeStamp: number } } }) => {
      const date = toFormatDate({ date: props.row.original.createdAtTimeStamp, toFormat: 'DD/MM/YYYY' });
      const time = toFormatDate({ date: props.row.original.createdAtTimeStamp, toFormat: 'hh:mm a' });
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium text-fg-primary">{date}</div>
          <div className="text-xs text-fg-secondary">{time}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <DollarSign className="w-4 h-4" />
        Amount
      </div>
    ),
    minSize: 120,
    cell(props: { row: { original: { amount: number; currencySymbol: string } } }) {
      const amount = props.row.original.amount;
      const currency = props.row.original.currencySymbol || '₹';
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-color-success/10 text-color-success border border-color-success/20 rounded-lg text-sm font-semibold">
          <DollarSign className="w-3 h-3" />
          {currency} {amount?.toLocaleString() || '0'}
        </div>
      );
    },
  },
  {
    accessorKey: 'extraCharges',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <Target className="w-4 h-4" />
        Extra Charges
      </div>
    ),
    minSize: 120,
    cell(props: { row: { original: { extraCharges: number; currencySymbol: string } } }) {
      const extraCharges = props.row.original.extraCharges;
      const currency = props.row.original.currencySymbol || '₹';

      if (!extraCharges || extraCharges === 0) {
        return <span className="text-xs text-fg-tertiary">No charges</span>;
      }

      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-color-warning/10 text-color-warning border border-color-warning/20 rounded-lg text-sm font-medium">
          <AlertTriangle className="w-3 h-3" />
          {currency} {extraCharges?.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'paymentMode',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <CreditCard className="w-4 h-4" />
        Payment Method
      </div>
    ),
    cell(props: { row: { original: { paymentMode: string } } }) {
      const badge = getPaymentMethodBadge(props.row.original.paymentMode);
      return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${badge.color}`}>
          {badge.icon}
          {badge.label}
        </div>
      );
    },
  },
  {
    accessorKey: 'remarks',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <MessageSquare className="w-4 h-4" />
        Remarks
      </div>
    ),
    cell: (props) => {
      const remarks = props.row.original.remarks;
      return remarks ? (
        <div className="max-w-xs">
          <p className="text-sm text-fg-primary line-clamp-2" title={remarks}>
            {remarks}
          </p>
        </div>
      ) : (
        <span className="text-xs text-fg-tertiary">No remarks</span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <Clock className="w-4 h-4" />
        Status
      </div>
    ),
    cell: (props: { row: { original: { updatedAt: string | number | Date; commit: string | number | Date } } }) => {
      const badge = getStatusBadge(props.row.original.updatedAt, props.row.original.commit);
      return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${badge.color}`}>
          {badge.icon}
          {badge.label}
        </div>
      );
    },
  },
  {
    accessorKey: 'creator',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <User className="w-4 h-4" />
        Processed By
      </div>
    ),
    cell: (props: { row: { original: { followedBy: [{ firstname: any; lastname: any }] } } }) => {
      const followedBy = props.row.original.followedBy?.[0];
      const firstname = followedBy?.firstname ?? '';
      const lastname = followedBy?.lastname ?? '';
      const fullName = `${firstname} ${lastname}`.trim();
      const initials = `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();

      return fullName ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-color-secondary/10 border border-color-secondary/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-color-secondary">{initials}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">{fullName}</span>
            <span className="text-xs text-fg-secondary">Agent</span>
          </div>
        </div>
      ) : (
        <span className="text-xs text-fg-tertiary">System</span>
      );
    },
  },
];

const Payments = ({ paymentsData }: { paymentsData: any[] }) => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');

  // Filter and search logic
  const filteredData =
    paymentsData?.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.paymentMode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.amount?.toString().includes(searchTerm);

      if (filterMethod === 'all') return matchesSearch;

      const badge = getPaymentMethodBadge(item.paymentMode);
      return matchesSearch && badge.label.toLowerCase().includes(filterMethod.toLowerCase());
    }) || [];

  const getStats = () => {
    const total = paymentsData?.length || 0;
    const totalAmount = paymentsData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
    const totalCharges = paymentsData?.reduce((sum, payment) => sum + (payment.extraCharges || 0), 0) || 0;
    const digitalPayments =
      paymentsData?.filter((payment) => {
        const mode = payment.paymentMode?.toLowerCase();
        return ['upi', 'digital', 'online', 'card', 'credit card', 'debit card'].includes(mode);
      }).length || 0;

    return { total, totalAmount, totalCharges, digitalPayments };
  };

  const stats = getStats();

  return (
    <Fragment>
      {!!paymentsData?.length ? (
        <div className="space-y-6">
          {/* Header with Stats */}
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
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-color-success/3 via-transparent to-color-primary/3"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-color-success/10 rounded-lg border border-color-success/20">
                    <TrendingUp className="h-5 w-5 text-color-success" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-fg-primary">Payment History</h2>
                    <p className="text-sm text-fg-secondary">Complete transaction records and payment details</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-fg-primary">{stats.total}</div>
                  <div className="text-xs text-fg-secondary">Total Payments</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-color-success/10 border border-color-success/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-success">₹{stats.totalAmount.toLocaleString()}</div>
                  <div className="text-xs text-fg-secondary">Total Amount</div>
                </div>
                <div className="bg-color-warning/10 border border-color-warning/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-warning">₹{stats.totalCharges.toLocaleString()}</div>
                  <div className="text-xs text-fg-secondary">Extra Charges</div>
                </div>
                <div className="bg-color-primary/10 border border-color-primary/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-primary">₹{stats.digitalPayments}</div>
                  <div className="text-xs text-fg-secondary">Digital Payments</div>
                </div>
                <div className="bg-color-info/10 border border-color-info/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-info">
                    ₹{stats.totalAmount > 0 ? (stats.totalAmount / stats.total).toFixed(0) : 0}
                  </div>
                  <div className="text-xs text-fg-secondary">Avg. Payment</div>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
                  <input
                    type="text"
                    placeholder="Search amount, remarks, or payment method..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-color-surface border border-fg-border rounded-lg text-sm focus:border-color-primary/50 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
                  <select
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-color-surface border border-fg-border rounded-lg text-sm focus:border-color-primary/50 focus:outline-none appearance-none"
                  >
                    <option value="all">All Methods</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="digital">Digital</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-12 h-12 bg-color-info rounded-full -translate-y-6 translate-x-6"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-color-accent rounded-full translate-y-4 -translate-x-4"></div>
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
            <div className="absolute inset-0 bg-gradient-to-r from-color-info/3 via-transparent to-color-accent/3"></div>

            <div className="relative z-10">
              {filteredData.length > 0 ? (
                <RTable
                  columns={columns}
                  data={filteredData.slice(page * 10, page * 10 + 10)}
                  total={filteredData.length}
                  page={page}
                  handlePageChange={setPage}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-fg-tertiary/10 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-fg-tertiary" />
                  </div>
                  <h3 className="text-lg font-semibold text-fg-primary mb-2">No Results Found</h3>
                  <p className="text-fg-secondary text-center max-w-md">
                    {searchTerm || filterMethod !== 'all'
                      ? 'Try adjusting your search terms or filters'
                      : 'No payment records match your criteria'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl p-12 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-20 h-20 bg-color-success rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-color-primary rounded-full translate-y-8 -translate-x-8"></div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-color-success/3 via-transparent to-color-primary/3"></div>

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-color-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-color-success" />
            </div>
            <h3 className="text-xl font-bold text-fg-primary mb-3">No Payment Records</h3>
            <p className="text-fg-secondary max-w-md mx-auto leading-relaxed">
              There are no payment transactions recorded for this case yet. Payment records will appear here once
              transactions are processed.
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Payments;
