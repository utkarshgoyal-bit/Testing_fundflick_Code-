import { RTable } from '@/components/shared/table';
import { formatDate } from '@/helpers/dateFormater';
import { BEHAVIOUR } from '@/lib/enums';
import { FollowUpData } from '@/lib/interfaces/index';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Fragment, useState } from 'react';
import {
  MessageSquare,
  Calendar,
  User,
  Clock,
  Target,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Minus,
  TrendingUp,
  Filter,
  Search,
} from 'lucide-react';

const getAttitudeBadge = (attitude: string) => {
  const normalizedAttitude = attitude?.toUpperCase();

  switch (normalizedAttitude) {
    case BEHAVIOUR.POLITE:
      return {
        color: 'bg-color-success/10 text-color-success border border-color-success/20',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Polite',
      };
    case BEHAVIOUR.RUDE:
      return {
        color: 'bg-color-error/10 text-color-error border border-color-error/20',
        icon: <XCircle className="w-3 h-3" />,
        label: 'Rude',
      };
    case BEHAVIOUR.MEDIUM:
      return {
        color: 'bg-color-warning/10 text-color-warning border border-color-warning/20',
        icon: <AlertTriangle className="w-3 h-3" />,
        label: 'Medium',
      };
    case BEHAVIOUR.NOREPLY:
      return {
        color: 'bg-fg-tertiary/10 text-fg-tertiary border border-fg-border',
        icon: <Minus className="w-3 h-3" />,
        label: 'No Reply',
      };
    default:
      return {
        color: 'bg-fg-tertiary/10 text-fg-tertiary border border-fg-border',
        icon: <Minus className="w-3 h-3" />,
        label: 'N/A',
      };
  }
};

const getStatusBadge = (updatedAt: string | number | Date, commit: string | number | Date) => {
  const voucherDate = moment(updatedAt);
  const p2pDate = moment(commit);
  const today = moment();

  const isOverdue = voucherDate.isValid() && p2pDate.isValid() && voucherDate.isBefore(today);
  const isOnTime =
    voucherDate.isValid() && p2pDate.isValid() && voucherDate.isSame(today) && p2pDate.isSameOrAfter(today);
  const isUpcoming = p2pDate.isValid() && p2pDate.isAfter(today);

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
      color: 'bg-fg-tertiary/10 text-fg-tertiary border border-fg-border',
      icon: <Minus className="w-3 h-3" />,
      label: 'N/A',
    };
  }
};

const getVisitTypeIcon = (visitType: string) => {
  const type = visitType?.toLowerCase();
  switch (type) {
    case 'call':
    case 'phone':
      return <Phone className="w-3 h-3" />;
    case 'email':
      return <Mail className="w-3 h-3" />;
    case 'visit':
    case 'physical':
      return <MapPin className="w-3 h-3" />;
    default:
      return <MessageSquare className="w-3 h-3" />;
  }
};

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'attitude',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <MessageSquare className="w-4 h-4" />
        Attitude
      </div>
    ),
    minSize: 120,
    cell: (props: { row: { original: { attitude: string } } }) => {
      const badge = getAttitudeBadge(props?.row?.original?.attitude);
      return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${badge.color}`}>
          {badge.icon}
          {badge.label}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <Calendar className="w-4 h-4" />
        Date & Time
      </div>
    ),
    cell: (props) => {
      const date = formatDate(props.row.original?.createdAt, 'DD/MM/YYYY');
      const time = formatDate(props.row.original?.createdAt, 'hh:mm a');
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium text-fg-primary">{date}</div>
          <div className="text-xs text-fg-secondary">{time}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'commit',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <Target className="w-4 h-4" />
        Promise to Pay
      </div>
    ),
    minSize: 120,
    cell(props) {
      const p2pDate = formatDate(props.row.original.commit, 'DD/MM/YYYY');
      return p2pDate ? (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-color-info/10 text-color-info border border-color-info/20 rounded-lg text-xs font-medium">
          <Calendar className="w-3 h-3" />
          {p2pDate}
        </div>
      ) : (
        <span className="text-xs text-fg-tertiary">Not set</span>
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
    accessorKey: 'visitType',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <Phone className="w-4 h-4" />
        Contact Type
      </div>
    ),
    cell(props: { row: { original: { visitType: string } } }) {
      const visitType = props.row.original.visitType;
      const icon = getVisitTypeIcon(visitType);
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-color-primary/10 text-color-primary border border-color-primary/20 rounded-lg text-xs font-medium">
          {icon}
          {visitType?.toUpperCase() || 'N/A'}
        </div>
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
        Follow Up By
      </div>
    ),
    cell: (props: { row: { original: { followedBy: [{ firstname: string; lastname: string }] } } }) => {
      const { firstname = '', lastname = '' } = props.row.original.followedBy?.[0] ?? {};
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
        <span className="text-xs text-fg-tertiary">Unknown</span>
      );
    },
  },
];

const FollowUp = ({ followUpData }: { followUpData: FollowUpData[] }) => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter and search logic
  const filteredData =
    followUpData?.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.visitType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.attitude?.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterStatus === 'all') return matchesSearch;

      const badge = getStatusBadge(item.updatedAt, item.commit);
      return matchesSearch && badge.label.toLowerCase() === filterStatus;
    }) || [];

  const getStats = () => {
    const total = followUpData?.length || 0;
    const polite = followUpData?.filter((item) => item.attitude?.toUpperCase() === BEHAVIOUR.POLITE).length || 0;
    const overdue =
      followUpData?.filter((item) => {
        const badge = getStatusBadge(item.updatedAt, item.commit);
        return badge.label === 'Overdue';
      }).length || 0;
    const withPromise = followUpData?.filter((item) => item.commit).length || 0;

    return { total, polite, overdue, withPromise };
  };

  const stats = getStats();

  return (
    <Fragment>
      {!!followUpData?.length ? (
        <div className="space-y-6">
          {/* Header with Stats */}
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
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-secondary/3"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-color-primary/10 rounded-lg border border-color-primary/20">
                    <TrendingUp className="h-5 w-5 text-color-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-fg-primary">Follow-Up History</h2>
                    <p className="text-sm text-fg-secondary">Customer interaction timeline and communication records</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-fg-primary">{stats.total}</div>
                  <div className="text-xs text-fg-secondary">Total Follow-ups</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-color-success/10 border border-color-success/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-success">{stats.polite}</div>
                  <div className="text-xs text-fg-secondary">Positive Interactions</div>
                </div>
                <div className="bg-color-error/10 border border-color-error/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-error">{stats.overdue}</div>
                  <div className="text-xs text-fg-secondary">Overdue Items</div>
                </div>
                <div className="bg-color-info/10 border border-color-info/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-info">{stats.withPromise}</div>
                  <div className="text-xs text-fg-secondary">With Promises</div>
                </div>
                <div className="bg-color-warning/10 border border-color-warning/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-warning">
                    {Math.round((stats.polite / stats.total) * 100)}%
                  </div>
                  <div className="text-xs text-fg-secondary">Success Rate</div>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
                  <input
                    type="text"
                    placeholder="Search remarks, visit type, or attitude..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-color-surface border border-fg-border rounded-lg text-sm focus:border-color-primary/50 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-color-surface border border-fg-border rounded-lg text-sm focus:border-color-primary/50 focus:outline-none appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="on-time">On-time</option>
                    <option value="overdue">Overdue</option>
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
                    {searchTerm || filterStatus !== 'all'
                      ? 'Try adjusting your search terms or filters'
                      : 'No follow-up records match your criteria'}
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
            {/* <div className="absolute top-0 right-0 w-20 h-20 bg-color-primary rounded-full -translate-y-10 translate-x-10"></div> */}
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-color-secondary rounded-full translate-y-8 -translate-x-8"></div>
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

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-color-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-color-primary" />
            </div>
            <h3 className="text-xl font-bold text-fg-primary mb-3">No Follow-up Records</h3>
            <p className="text-fg-secondary max-w-md mx-auto leading-relaxed">
              There are no follow-up interactions recorded for this case yet. Follow-up records will appear here once
              customer interactions begin.
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default FollowUp;
