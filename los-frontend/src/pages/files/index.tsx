import PageHeader from '@/components/shared/pageHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import camelToTitle from '@/helpers/camelToTitle';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { FILE_STATUS, ROUTES, STEPS_NAMES } from '@/lib/enums';
import { FETCH_CUSTOMER_FILES_DATA, RESET_CUSTOMER_FORM } from '@/redux/actions/types';
import { deleteFiltersData, setActiveStep, setFiltersData, setStepsData } from '@/redux/slices/files';
import { setActiveTab, setPendencyDialogOpen } from '@/redux/slices/pendency';
import { RootState } from '@/redux/store';
import socketHandler from '@/socket/handlers';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { isFileInAdminZone, isFileStatusApproved, isFileStatusPending } from '@/utils/checkFileStatus';
import { format } from 'date-fns';
import debounce from 'debounce';
import {
  AlertTriangle,
  BarChart3,
  Building,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  FileText,
  FileX,
  Filter,
  House,
  IndianRupee,
  PencilLine,
  Phone,
  Plus,
  Search,
  User,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CollectLoginFees from './collectLoginFees';
import FileStatus from './fileReview/fileStatus';
import Filters from './filter';
import { getFileStatusColor, getFileStatusIcon } from './fileHelpers';
import Pendencies from './pendencies';

function showLoanDetails({ loanType }: { loanType: string }) {
  if (loanType?.includes('home')) {
    return (
      <div className="flex items-center gap-1">
        <House size={18} />
        <span className={'text-sm capitalize'}>{loanType}</span>
      </div>
    );
  }
  if (loanType?.includes('vehicle')) {
    return (
      <div className="flex items-center gap-1">
        <Car size={18} />
        <span className={'text-sm capitalize'}>{loanType}</span>
      </div>
    );
  }
  if (loanType?.includes('personal')) {
    return (
      <div className="flex items-center gap-1">
        <User size={18} />
        <span className={'text-sm capitalize'}>{loanType}</span>
      </div>
    );
  }
  return '';
}
const statusOptions = [
  { label: 'pending', value: FILE_STATUS.PENDING },
  { label: 'approved', value: FILE_STATUS.APPROVED },
  { label: 'taskPending', value: FILE_STATUS.TASK_PENDING },
  { label: 'rejected', value: FILE_STATUS.REJECTED },
  { label: 'review', value: FILE_STATUS.REVIEW },
];

export default function CustomerManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const { pendencyDialogOpen } = useSelector((state: RootState) => state.pendency);
  const { tableConfiguration, loading, filters } = useSelector((state: RootState) => state.customerFiles);
  const { data, page, total, sort } = tableConfiguration;

  const handleSearch = useCallback(
    (value: string) => {
      const debouncedSearch = debounce(() => {
        if (value.length === 0) {
          dispatch(deleteFiltersData('search'));
          dispatch({ type: FETCH_CUSTOMER_FILES_DATA });
        } else {
          dispatch(setFiltersData({ ...filters, search: value }));
          dispatch({ type: FETCH_CUSTOMER_FILES_DATA });
        }
      }, 500);
      debouncedSearch();
    },
    [dispatch, filters]
  );

  useEffect(() => {
    dispatch({ type: FETCH_CUSTOMER_FILES_DATA });
  }, [page, total, sort, dispatch]);

  const onCancelHandler = (item: string) => {
    dispatch(deleteFiltersData(item));
    dispatch({ type: FETCH_CUSTOMER_FILES_DATA });
    if (item == 'search' && searchRef.current) {
      searchRef.current.value = '';
    }
  };

  const handleStatusFilter = (status: string) => {
    dispatch(setFiltersData({ ...filters, status }));
    dispatch({ type: FETCH_CUSTOMER_FILES_DATA });
  };

  const handlePendencyDialogOpen = (key: string, value: boolean) => {
    dispatch(setPendencyDialogOpen({ key, value }));
    if (value) {
      dispatch(setActiveTab('active'));
    }
  };

  // Statistics calculation
  const stats = {
    total: data.length,
    approved: data.filter((item) => item.status.toLowerCase() === 'approved').length,
    pending: data.filter((item) => item.status.toLowerCase() === 'pending').length,
    rejected: data.filter((item) => item.status.toLowerCase() === 'rejected').length,
    taskPending: data.filter((item) => item.status.toLowerCase() === 'task pending').length,
  };

  return (
    <>
      <Helmet>
        <title>LOS | Customer Files</title>
      </Helmet>

      {/* Enhanced Header */}
      <PageHeader
        title="Customer Files"
        subtitle="Manage and track all customer loan applications"
        actions={
          <div className="flex items-center gap-3">
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-fg-border hover:bg-color-surface-muted">
                  <Filter className="h-4 w-4 mr-2" />
                  <I8nTextWrapper text="filters" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <I8nTextWrapper text="areInactive" />
                  </DialogTitle>
                  <DialogDescription>
                    <I8nTextWrapper text="filterYourFiles" />
                  </DialogDescription>
                </DialogHeader>
                <Filters setFilterOpen={setFilterOpen} />
              </DialogContent>
            </Dialog>
            {hasPermission(PERMISSIONS.CUSTOMER_FILE_CREATE) && (
              <Link
                to={buildOrgRoute(ROUTES.CUSTOMER_FILE_MANAGEMENT_REGISTER)}
                onClick={() => dispatch({ type: RESET_CUSTOMER_FORM })}
              >
                <Button className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  <I8nTextWrapper text="registerCustomerFile" />
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-12 h-12 bg-color-primary rounded-full -translate-y-6 translate-x-6"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-color-primary" />
              <span className="text-xs text-fg-tertiary">Total</span>
            </div>
            <div className="text-xl font-bold text-fg-primary">{stats.total}</div>
            <div className="text-xs text-fg-secondary">Files</div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-12 h-12 bg-color-success rounded-full -translate-y-6 translate-x-6"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-color-success" />
              <I8nTextWrapper text="approved" className="text-xs text-fg-tertiary" />
            </div>
            <div className="text-xl font-bold text-fg-primary">{stats.approved}</div>
            <div className="text-xs text-fg-secondary">Files</div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-12 h-12 bg-color-warning rounded-full -translate-y-6 translate-x-6"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-color-warning" />
              <I8nTextWrapper text="pending" className="text-xs text-fg-tertiary" />
            </div>
            <div className="text-xl font-bold text-fg-primary">{stats.pending}</div>
            <div className="text-xs text-fg-secondary">Files</div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-12 h-12 bg-color-error rounded-full -translate-y-6 translate-x-6"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <FileX className="h-5 w-5 text-color-error" />
              <I8nTextWrapper text="rejected" className="text-xs text-fg-tertiary" />
            </div>
            <div className="text-xl font-bold text-fg-primary">{stats.rejected}</div>
            <div className="text-xs text-fg-secondary">Files</div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-12 h-12 bg-color-warning rounded-full -translate-y-6 translate-x-6"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-color-warning" />
              <I8nTextWrapper text="tasks" className="text-xs text-fg-tertiary" />
            </div>
            <div className="text-xl font-bold text-fg-primary">{stats.taskPending}</div>
            <div className="text-xs text-fg-secondary">
              <I8nTextWrapper text="pending" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-color-surface border border-fg-border rounded-lg p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-tertiary" />
            <Input
              ref={searchRef}
              placeholder="Search files by name, phone, or file number..."
              className="pl-10 bg-color-surface border-fg-border focus:border-color-primary/50"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Active Filters */}
          {filters && Object.keys(filters).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-fg-tertiary">Active filters:</span>
              {Object.keys(filters).map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-color-primary/10 text-color-primary rounded-full px-3 py-1 text-sm border border-color-primary/20"
                >
                  {camelToTitle(item)}: {camelToTitle(filters[item as keyof typeof filters])}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onCancelHandler(item)} />
                </div>
              ))}
            </div>
          )}

          {/* Status Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <Button
                key={status.value}
                variant={filters?.status === status.value ? 'default' : 'outline'}
                size="sm"
                className={
                  filters?.status === status.value
                    ? 'bg-color-primary text-fg-on-accent'
                    : 'border-fg-border hover:bg-color-surface-muted'
                }
                onClick={() => handleStatusFilter(status.value)}
              >
                <I8nTextWrapper text={status.label} />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Files Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="bg-color-surface border border-fg-border rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-24 bg-color-surface-muted" />
                    <Skeleton className="h-6 w-20 bg-color-surface-muted" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-color-surface-muted" />
                    <Skeleton className="h-4 w-3/4 bg-color-surface-muted" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 bg-color-surface-muted" />
                    <Skeleton className="h-8 w-16 bg-color-surface-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item: any, index: number) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-color-primary/30"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-3">
                  {/* <div className="absolute top-0 right-0 w-16 h-16 bg-color-primary rounded-full -translate-y-8 translate-x-8"></div> */}
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-secondary rounded-full translate-y-6 -translate-x-6"></div>
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
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-color-primary" />
                        <span className="font-bold text-lg text-fg-primary">
                          FI:{String(item.loanApplicationNumber).padStart(4, '0')}
                        </span>
                      </div>
                      {((isFileStatusPending(item.status) && hasPermission(PERMISSIONS.CUSTOMER_FILE_UPDATE)) ||
                        hasPermission(PERMISSIONS.CUSTOMER_FILE_UPDATE_AFTER_PENDING) ||
                        hasPermission(PERMISSIONS.CUSTOMER_APPROVED_FILE_EDIT)) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-color-primary/10"
                          onClick={() => {
                            dispatch(setStepsData(item));
                            dispatch(setActiveStep(STEPS_NAMES.CUSTOMER));
                            navigate({
                              pathname: buildOrgRoute(ROUTES.CUSTOMER_FILE_MANAGEMENT_REGISTER),
                              search: `?edit=true&id=${item._id}`,
                            });
                          }}
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getFileStatusColor(item.status)}`}
                    >
                      <div className="flex items-center gap-1">
                        {getFileStatusIcon(item.status)}
                        <span>{item.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-fg-primary mb-2">
                      {`${item.customerDetails.firstName ?? ''} ${item.customerDetails.middleName ?? ''} ${item.customerDetails.lastName ?? ''}`.trim()}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-fg-secondary">
                      {showLoanDetails({ loanType: item.loanType })}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-color-accent" />
                      <span className="text-sm text-fg-secondary">
                        <I8nTextWrapper text="loanAmount" />:
                      </span>
                      <span className="font-medium text-fg-primary">₹{item.loanAmount?.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-color-secondary" />
                      <span className="text-sm text-fg-secondary">
                        <I8nTextWrapper text="marketingMng" />:
                      </span>
                      <span className="font-medium text-fg-primary">
                        {item.createdBy?.employeeId?.firstName} {item.createdBy?.employeeId?.lastName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-color-info" />
                      <Link
                        to={`tel:${item.customerDetails.phone}`}
                        className="text-sm text-color-primary hover:underline"
                      >
                        +{item?.customerDetails.phone?.slice(0, 2)} {item?.customerDetails.phone?.slice(2)}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-fg-tertiary" />
                      <span className="text-sm text-fg-secondary">
                        <I8nTextWrapper text="loanDate" />:
                      </span>
                      <span className="font-medium text-fg-primary">{format(item.createdAt, 'dd/MM/yyyy')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-fg-border">
                    {((hasPermission(PERMISSIONS.CUSTOMER_FILE_TAB) && !isFileInAdminZone(item.status)) ||
                      (hasPermission(PERMISSIONS.CUSTOMER_APPROVED_FILE_VIEW) && isFileInAdminZone(item.status))) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-color-primary/10 hover:text-color-primary"
                        onClick={() => {
                          dispatch(setStepsData(item));
                          navigate({
                            pathname: buildOrgRoute(`${ROUTES.CUSTOMER_FILE_MANAGEMENT}${ROUTES.VIEW_CUSTOMER_FILE}`),
                            search: `?id=${item._id}`,
                          });
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}

                    {hasPermission(PERMISSIONS.CUSTOMER_FILE_STAGE_REPORT) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-color-secondary/10 hover:text-color-secondary"
                            onClick={() => socketHandler.handleRead(item.loanApplicationNumber)}
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            <I8nTextWrapper text="stageReports" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full">
                          <DialogHeader>
                            <DialogTitle>
                              <I8nTextWrapper text="manageFileStatus" />
                            </DialogTitle>
                            <DialogDescription>
                              <I8nTextWrapper text="makeChangesInFileStatus" />
                            </DialogDescription>
                          </DialogHeader>
                          <FileStatus file={item} />
                        </DialogContent>
                      </Dialog>
                    )}

                    {hasPermission(PERMISSIONS.PENDENCY_TAB) && (
                      <Dialog
                        open={pendencyDialogOpen[item.loanApplicationNumber]}
                        onOpenChange={(open) => handlePendencyDialogOpen(item.loanApplicationNumber, open)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-color-warning/10 hover:text-color-warning relative"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <I8nTextWrapper text="pendencies" />
                            {item.status === 'Task Pending' && (
                              <span className="absolute -top-1 -right-1 h-2 w-2 bg-color-error rounded-full" />
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full max-h-[80vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>
                              <I8nTextWrapper text="manageFilePendencies" />
                            </DialogTitle>
                            <DialogDescription>
                              <I8nTextWrapper text="allPendencies" />
                            </DialogDescription>
                          </DialogHeader>
                          <Pendencies loanApplicationNumber={item.loanApplicationNumber} fileStatus={item.status} />
                        </DialogContent>
                      </Dialog>
                    )}

                    {isFileStatusApproved(item.status) &&
                      !item?.loanApplicationFilePayment?.amount &&
                      hasPermission(PERMISSIONS.CUSTOMER_FILE_FEES) && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 hover:bg-color-success/10 hover:text-color-success animate-pulse"
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              <I8nTextWrapper text="collectLoginFees" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                <I8nTextWrapper text="collectLoginFees" />
                              </DialogTitle>
                              <DialogDescription>
                                <CollectLoginFees loanApplicationNumber={item.loanApplicationNumber} />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      )}

                    {hasPermission(PERMISSIONS.CUSTOMER_FILE_BACK_OFFICE) &&
                      item.status.toLowerCase() === 'approved' && (
                        <Link
                          to={buildOrgRoute(`${ROUTES.CUSTOMER_FILE_MANAGEMENT}/back_office?id=${item._id}`)}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full hover:bg-color-accent/10 hover:text-color-accent"
                          >
                            <Building className="h-4 w-4 mr-2" />
                            <I8nTextWrapper text="backOffice" />
                          </Button>
                        </Link>
                      )}

                    {hasPermission(PERMISSIONS.CREDIT_VIEW) && (
                      <Link
                        to={buildOrgRoute(`${ROUTES.CUSTOMER_FILE_MANAGEMENT}/credit?id=${item._id}`)}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full hover:bg-color-info/10 hover:text-color-info"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          <I8nTextWrapper text="credit" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto bg-color-surface-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-fg-tertiary" />
              </div>
              <h3 className="text-lg font-semibold text-fg-primary mb-2">No Files Found</h3>
              <p className="text-fg-secondary mb-6">
                No customer files match your current criteria. Try adjusting your search or filters.
              </p>
              {hasPermission(PERMISSIONS.CUSTOMER_FILE_CREATE) && (
                <Link
                  to={buildOrgRoute(ROUTES.CUSTOMER_FILE_MANAGEMENT_REGISTER)}
                  onClick={() => dispatch({ type: RESET_CUSTOMER_FORM })}
                >
                  <Button className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                    <Plus className="h-4 w-4 mr-2" />
                    <I8nTextWrapper text="registerCustomerFile" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
