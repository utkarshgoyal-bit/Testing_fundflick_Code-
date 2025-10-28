import { AlertCircle, AlertTriangle, CheckCircle, Clock, FileText, FileX } from 'lucide-react';

const getFileStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-color-success" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-color-warning" />;
    case 'rejected':
      return <FileX className="h-4 w-4 text-color-error" />;
    case 'task pending':
      return <AlertTriangle className="h-4 w-4 text-color-warning" />;
    case 'review':
      return <AlertCircle className="h-4 w-4 text-color-info" />;
    default:
      return <FileText className="h-4 w-4 text-fg-tertiary" />;
  }
};

const getFileStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-color-success/10 text-color-success border-color-success/20';
    case 'pending':
      return 'bg-color-warning/10 text-color-warning border-color-warning/20';
    case 'rejected':
      return 'bg-color-error/10 text-color-error border-color-error/20';
    case 'task pending':
      return 'bg-color-warning/10 text-color-warning border-color-warning/20';
    case 'review':
      return 'bg-color-info/10 text-color-info border-color-info/20';
    default:
      return 'bg-color-surface-muted text-fg-secondary border-fg-border';
  }
};

export { getFileStatusColor, getFileStatusIcon };
