import { RTable } from '@/components/shared/table';
import { ColumnDef } from '@tanstack/react-table';
import { useState, Fragment } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FileText,
  Eye,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  TrendingUp,
  Filter,
  Search,
  FileCheck,
  FileMinus,
  Calendar,
  User,
} from 'lucide-react';

const getDocumentStatusBadge = (status: string) => {
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case 'uploaded':
    case 'verified':
      return {
        color: 'bg-color-success/10 text-color-success border border-color-success/20',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Uploaded',
      };
    case 'pending':
    case 'under review':
      return {
        color: 'bg-color-warning/10 text-color-warning border border-color-warning/20',
        icon: <Clock className="w-3 h-3" />,
        label: 'Pending',
      };
    case 'rejected':
    case 'invalid':
      return {
        color: 'bg-color-error/10 text-color-error border border-color-error/20',
        icon: <XCircle className="w-3 h-3" />,
        label: 'Rejected',
      };
    case 'missing':
    case 'not uploaded':
      return {
        color: 'bg-fg-tertiary/10 text-fg-tertiary border border-fg-border',
        icon: <FileMinus className="w-3 h-3" />,
        label: 'Missing',
      };
    default:
      return {
        color: 'bg-fg-tertiary/10 text-fg-tertiary border border-fg-border',
        icon: <FileText className="w-3 h-3" />,
        label: status || 'Unknown',
      };
  }
};

const getDocumentTypeIcon = (docType: string) => {
  const type = docType?.toLowerCase();
  switch (type) {
    case 'kyc':
      return <Shield className="w-3 h-3" />;
    case 'income':
      return <TrendingUp className="w-3 h-3" />;
    case 'banking':
      return <FileCheck className="w-3 h-3" />;
    case 'liability':
      return <AlertTriangle className="w-3 h-3" />;
    case 'collateral':
      return <Shield className="w-3 h-3" />;
    default:
      return <FileText className="w-3 h-3" />;
  }
};

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'DocumentName',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <FileText className="w-4 h-4" />
        Document Type
      </div>
    ),
    cell: (props: { row: { original: { DocumentName: string; id: string } } }) => {
      const docName = props.row.original.DocumentName;
      const docId = props.row.original.id;
      const icon = getDocumentTypeIcon(docId);

      return (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-color-primary/10 rounded-lg border border-color-primary/20">{icon}</div>
          <div>
            <div className="text-sm font-medium text-fg-primary">{docName}</div>
            <div className="text-xs text-fg-secondary">{docId.toUpperCase()} Documentation</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <CheckCircle className="w-4 h-4" />
        Status
      </div>
    ),
    cell: (props: { row: { original: { status: string } } }) => {
      const badge = getDocumentStatusBadge(props.row.original.status);
      return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${badge.color}`}>
          {badge.icon}
          {badge.label}
        </div>
      );
    },
  },
  {
    accessorKey: 'about',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <FileText className="w-4 h-4" />
        Description
      </div>
    ),
    cell: (props) => {
      const about = props.row.original.about;
      return about ? (
        <div className="max-w-xs">
          <p className="text-sm text-fg-primary line-clamp-2" title={about}>
            {about}
          </p>
        </div>
      ) : (
        <span className="text-xs text-fg-tertiary">No description</span>
      );
    },
  },
  {
    accessorKey: 'uploadDate',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <Calendar className="w-4 h-4" />
        Upload Date
      </div>
    ),
    cell: (props) => {
      const uploadDate = props.row.original.uploadDate;
      return uploadDate ? (
        <div className="space-y-1">
          <div className="text-sm font-medium text-fg-primary">{uploadDate}</div>
          <div className="text-xs text-fg-secondary">Document uploaded</div>
        </div>
      ) : (
        <span className="text-xs text-fg-tertiary">Not uploaded</span>
      );
    },
  },
  {
    accessorKey: 'uploadedBy',
    header: () => (
      <div className="flex items-center gap-2 text-left font-medium text-fg-primary">
        <User className="w-4 h-4" />
        Uploaded By
      </div>
    ),
    cell: (props: { row: { original: { uploadedBy?: string } } }) => {
      const uploadedBy = props.row.original.uploadedBy;
      const initials =
        uploadedBy
          ?.split(' ')
          .map((name) => name.charAt(0))
          .join('')
          .toUpperCase() || 'SY';

      return uploadedBy ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-color-secondary/10 border border-color-secondary/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-color-secondary">{initials}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">{uploadedBy}</span>
            <span className="text-xs text-fg-secondary">System User</span>
          </div>
        </div>
      ) : (
        <span className="text-xs text-fg-tertiary">System</span>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: () => <div className="flex items-center gap-2 text-left font-medium text-fg-primary">Actions</div>,
    cell: (props) => {
      const document = props.row.original;
      const hasDocument = document.status?.toLowerCase() === 'uploaded';

      return (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="p-1.5 text-color-primary hover:bg-color-primary/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasDocument}
                title={hasDocument ? 'View document' : 'Document not uploaded'}
              >
                <Eye className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[90vw] max-md:w-[100vw] max-md:max-w-[100vw] max-h-[90vh] h-[90vh] flex flex-col overflow-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="p-2 bg-color-primary/10 rounded-lg border border-color-primary/20">
                    <Eye className="w-5 h-5 text-color-primary" />
                  </div>
                  Document Viewer
                </DialogTitle>
                <DialogDescription>
                  {document.DocumentName} - {document.about}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 bg-color-surface-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-fg-tertiary mx-auto mb-4" />
                  <p className="text-fg-secondary">Document preview will be displayed here</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <button
            className="p-1.5 text-color-info hover:bg-color-info/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasDocument}
            title={hasDocument ? 'Download document' : 'Document not uploaded'}
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            className="p-1.5 text-color-secondary hover:bg-color-secondary/10 rounded-lg transition-all duration-200"
            title="Upload new version"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      );
    },
  },
];

export default function DocumentTable() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const data = [
    {
      id: 'kyc',
      DocumentName: 'KYC',
      status: 'Uploaded',
      about: 'KYC verification documents including PAN, Aadhar, and address proof',
      uploadDate: '15/12/2023',
      uploadedBy: 'John Doe',
    },
    {
      id: 'income',
      DocumentName: 'Income',
      status: 'Pending',
      about: 'Salary slips, bank statements, and income tax returns',
      uploadDate: '14/12/2023',
      uploadedBy: 'Jane Smith',
    },
    {
      id: 'liability',
      DocumentName: 'Liability',
      status: 'Rejected',
      about: 'Existing loan documents, credit card statements, and liability proof',
      uploadDate: '13/12/2023',
      uploadedBy: 'Mike Johnson',
    },
    {
      id: 'collateral',
      DocumentName: 'Collateral',
      status: 'Uploaded',
      about: 'Property documents, vehicle registration, and collateral valuations',
      uploadDate: '12/12/2023',
      uploadedBy: 'Sarah Wilson',
    },
    {
      id: 'banking',
      DocumentName: 'Banking',
      status: 'Under Review',
      about: 'Bank statements, account details, and transaction history',
      uploadDate: '11/12/2023',
      uploadedBy: 'David Brown',
    },
    {
      id: 'other',
      DocumentName: 'Other',
      status: 'Missing',
      about: 'Additional supporting documents and miscellaneous files',
      uploadDate: null,
      uploadedBy: null,
    },
  ];

  // Filter and search logic
  const filteredData =
    data?.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.DocumentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.about?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterStatus === 'all') return matchesSearch;

      const badge = getDocumentStatusBadge(item.status);
      return matchesSearch && badge.label.toLowerCase().includes(filterStatus.toLowerCase());
    }) || [];

  const getStats = () => {
    const total = data?.length || 0;
    const uploaded = data?.filter((item) => item.status?.toLowerCase() === 'uploaded').length || 0;
    const pending =
      data?.filter((item) => ['pending', 'under review'].includes(item.status?.toLowerCase())).length || 0;
    const missing =
      data?.filter((item) => ['missing', 'not uploaded'].includes(item.status?.toLowerCase())).length || 0;

    return { total, uploaded, pending, missing };
  };

  const stats = getStats();

  return (
    <Fragment>
      {!!data?.length ? (
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
                    <FileText className="h-5 w-5 text-color-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-fg-primary">Document Management</h2>
                    <p className="text-sm text-fg-secondary">Complete document verification and management system</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-fg-primary">{stats.total}</div>
                  <div className="text-xs text-fg-secondary">Total Documents</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-color-success/10 border border-color-success/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-success">{stats.uploaded}</div>
                  <div className="text-xs text-fg-secondary">Uploaded</div>
                </div>
                <div className="bg-color-warning/10 border border-color-warning/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-warning">{stats.pending}</div>
                  <div className="text-xs text-fg-secondary">Under Review</div>
                </div>
                <div className="bg-color-error/10 border border-color-error/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-error">{stats.missing}</div>
                  <div className="text-xs text-fg-secondary">Missing</div>
                </div>
                <div className="bg-color-info/10 border border-color-info/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-color-info">
                    {stats.uploaded > 0 ? Math.round((stats.uploaded / stats.total) * 100) : 0}%
                  </div>
                  <div className="text-xs text-fg-secondary">Completion</div>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
                  <input
                    type="text"
                    placeholder="Search documents, status, or description..."
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
                    <option value="uploaded">Uploaded</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="missing">Missing</option>
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
                      : 'No documents match your criteria'}
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
              <FileText className="w-10 h-10 text-color-primary" />
            </div>
            <h3 className="text-xl font-bold text-fg-primary mb-3">No Documents Available</h3>
            <p className="text-fg-secondary max-w-md mx-auto leading-relaxed">
              No documents have been uploaded for this case yet. Document records will appear here once files are
              uploaded and processed.
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
}
