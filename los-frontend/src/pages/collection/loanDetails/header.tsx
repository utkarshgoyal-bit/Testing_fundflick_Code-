import PageHeader from '@/components/shared/pageHeader';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import generateGoogleMapsURL from '@/helpers/generateGoogleMapsURL';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ILoadDetailsDashBoard } from '@/lib/interfaces/index';
import { cn } from '@/lib/utils';
import { FETCH_COLLECTION_BY_CASE_NO } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { ASSIGN_USER_TO_CASE, FLAG_CASE, UNASSIGN_CASE_USER, UPDATE_BRANCH_REQUEST } from '@/redux/store/actionTypes';
import {
  Activity,
  ArrowUpRight,
  Building2,
  Clock,
  Flag,
  Landmark,
  MapPin,
  Pencil,
  Phone,
  RotateCcw,
  TrendingUp,
  UserCheck,
  UserPlus,
  UserRoundCheck,
  Wallet,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CollectionCoApplicantView from './collectionCoapplicantsView';
import UpdateLocationForm from './updateLocationForm';
import { Textarea } from '@/components/ui/textarea';

const DashboardSection: React.FC<ILoadDetailsDashBoard> = ({
  loanDetails,
  isSuperAdmin,
  isBackOffice,
}: ILoadDetailsDashBoard) => {
  const dispatch = useDispatch();
  const [flagRemark, setFlagRemark] = useState(loanDetails?.flagRemark || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(loanDetails?.area || 'Select Branch');
  const branchTableConfig = useSelector((state: RootState) => state.branch.tableConfiguration);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingBranch, setPendingBranch] = useState<string | null>(null);
  const tableConfiguration = useSelector((state: RootState) => state.userManagement.tableConfiguration);

  const onFetchCollections = useCallback(() => {
    dispatch({
      type: FETCH_COLLECTION_BY_CASE_NO,
      payload: loanDetails?.caseNo,
    });
  }, [dispatch, loanDetails?.caseNo]);

  if (!loanDetails) {
    return (
      <div className="min-h-[300px] bg-color-surface rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-color-primary/20 border-t-color-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-fg-secondary">Loading loan details...</p>
        </div>
      </div>
    );
  }

  const handleBranchSelect = (branch: string) => {
    setPendingBranch(branch);
    setShowConfirmModal(true);
  };
  const onBranchHandler = () => {
    if (isSuperAdmin || isBackOffice) {
      setIsBranchDropdownOpen(!isBranchDropdownOpen);
    }
  };

  const confirmBranchUpdate = () => {
    if (!isSuperAdmin && !isBackOffice) {
      return;
    }
    if (loanDetails?.caseNo && pendingBranch) {
      dispatch({
        type: UPDATE_BRANCH_REQUEST,
        payload: { caseNo: loanDetails.caseNo, newBranch: pendingBranch },
      });
    }
    setSelectedBranch(pendingBranch!);
    setShowConfirmModal(false);
    setIsBranchDropdownOpen(false);
  };

  const cancelBranchUpdate = () => {
    setShowConfirmModal(false);
    setPendingBranch(null);
    setIsBranchDropdownOpen(false);
  };

  const handleCaseAssign = (user: any) => {
    const caseNo = loanDetails.caseNo;
    dispatch({
      type: ASSIGN_USER_TO_CASE,
      payload: {
        caseNo,
        userId: user.employeeId,
      },
    });
  };

  const handleUnassignCase = (caseNo: string) => {
    dispatch({
      type: UNASSIGN_CASE_USER,
      payload: { caseNo },
    });
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
      case 'secondary':
        return 'bg-color-secondary/10 text-color-secondary border-color-secondary/20';
      case 'success':
        return 'bg-color-success/10 text-color-success border-color-success/20';
      case 'warning':
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      case 'error':
        return 'bg-color-error/10 text-color-error border-color-error/20';
      default:
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
    }
  };

  const quickStats = [
    {
      label: 'Loan Amount',
      value: loanDetails.loanAmount || 'N/A',
      icon: Wallet,
      color: 'primary',
      description: 'Principal amount',
    },
    {
      label: 'Outstanding',
      value: loanDetails.outstandingAmount || 'N/A',
      icon: TrendingUp,
      color: 'warning',
      description: 'Remaining balance',
    },
    {
      label: 'Days Overdue',
      value: loanDetails.daysOverdue || '0',
      icon: Clock,
      color: 'error',
      description: 'Past due period',
    },
    {
      label: 'Risk Score',
      value: '70%',
      icon: Activity,
      color: 'success',
      description: 'Collection probability',
    },
  ];

  const handleFlagCase = () => {
    dispatch({
      type: FLAG_CASE,
      payload: {
        caseNo: loanDetails.caseNo,
        isFlagged: !loanDetails.isFlagged,
        flagRemark: flagRemark,
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={loanDetails.caseNo}
        subtitle={loanDetails.customer || 'N/A'}
        actions={
          <div className="flex items-center gap-3 flex-wrap">
            {/* Assign Button */}
            {hasPermission(PERMISSIONS.COLLECTION_ASSIGN_CASE) && (
              <div className="relative">
                <Button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-primary backdrop-blur-sm border border-white/30 hover:text-color-primary text-white hover:bg-white/30 transition-all"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign To
                </Button>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 w-72 bg-color-surface rounded-xl shadow-lg border border-fg-border z-50 max-h-64 overflow-y-auto">
                    <div className="p-2">
                      {tableConfiguration.data.map((item: any) => (
                        <div
                          key={item.employeeId}
                          className="p-3 hover:bg-color-surface-muted transition-colors cursor-pointer flex items-center gap-3 rounded-lg"
                          onClick={() => {
                            handleCaseAssign(item);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-color-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-color-primary">{item.name[0].toUpperCase()}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-fg-primary">{item.name}</p>
                            <p className="text-xs text-fg-secondary">{item.roleRef.name || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Links */}
            {(isSuperAdmin || isBackOffice) && (
              <>
                <Link
                  to={buildOrgRoute(`/collection/followUp/${loanDetails.caseNo}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary backdrop-blur-sm border border-white/30 hover:text-color-primary text-white  hover:bg-white/30 rounded-lg transition-all"
                >
                  <UserRoundCheck className="w-4 h-4" />
                  Follow Up
                </Link>

                <Link
                  to={buildOrgRoute(`/collection/collection/${loanDetails.caseNo}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary backdrop-blur-sm border border-white/30 hover:text-color-primary text-white hover:bg-white/30  rounded-lg  transition-all"
                >
                  <Landmark className="w-4 h-4" />
                  Collection
                </Link>
              </>
            )}

            {/* Additional Actions */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onFetchCollections}
                    className="bg-white/20 backdrop-blur-sm border border-primary text-color-primary hover:text-white hover:bg-primary transition-all p-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh Collections</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: loanDetails.isFlagged ? 'default' : 'outline', size: 'icon' }),
                  !loanDetails.isFlagged && 'bg-transparent'
                )}
              >
                <Flag className="w-4 h-4" />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none my-2">Flag Case</p>
                    <Textarea
                      value={flagRemark}
                      onChange={(e) => {
                        setFlagRemark(e.target.value);
                      }}
                      className="h-8"
                      placeholder="Flag Remark"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={handleFlagCase} className="w-full">
                      {loanDetails.isFlagged ? 'Unflag Case' : 'Flag Case'}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        }
      />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl p-4 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-3">
                <div
                  className={`absolute top-0 right-0 w-12 h-12 ${
                    stat.color === 'primary'
                      ? 'bg-color-primary'
                      : stat.color === 'success'
                        ? 'bg-color-success'
                        : stat.color === 'warning'
                          ? 'bg-color-warning'
                          : stat.color === 'error'
                            ? 'bg-color-error'
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

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg border ${getColorClasses(stat.color)}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>

                <div className="text-lg font-bold text-fg-primary mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-fg-tertiary mb-1">{stat.label}</div>
                <div className="text-xs text-fg-secondary">{stat.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer & Location Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Branch & Assignment */}
          <div className="bg-color-surface border border-fg-border rounded-xl p-4">
            <h3 className="text-lg font-semibold text-fg-primary mb-4">Assignment Details</h3>

            <div className="flex flex-wrap gap-3">
              {/* Branch Selector */}
              <div className="relative">
                <button
                  onClick={onBranchHandler}
                  disabled={!(isBackOffice || isSuperAdmin)}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isBackOffice || isSuperAdmin
                      ? 'bg-color-surface-muted border border-fg-border text-fg-primary hover:border-color-primary/50'
                      : 'bg-color-surface-muted text-fg-tertiary cursor-not-allowed'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium">{selectedBranch}</span>
                </button>

                {isBranchDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-color-surface rounded-xl shadow-lg border border-fg-border py-2 z-50">
                    {branchTableConfig?.data?.map((branch: any, index: number) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left hover:bg-color-surface-muted text-sm transition-colors"
                        onClick={() => handleBranchSelect(branch.name)}
                      >
                        {branch.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Assigned User */}
              {loanDetails.assignedTo && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-color-success/10 border border-color-success/20">
                  <UserCheck className="w-4 h-4 text-color-success" />
                  <span className="text-sm font-medium text-color-success">
                    {loanDetails.assignedTo?.firstName} {loanDetails.assignedTo?.lastName}
                  </span>
                  {hasPermission(PERMISSIONS.COLLECTION_UNASSIGN_CASE) && (
                    <button
                      onClick={() => handleUnassignCase(loanDetails.caseNo)}
                      className="p-1 rounded-md hover:bg-color-success/20 transition-colors"
                    >
                      <X className="w-3 h-3 text-color-success" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-color-surface border border-fg-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-fg-primary">Customer Information</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-fg-border hover:bg-color-surface-muted">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-w-[90vw] max-w-[90vw] max-h-[85vh] overflow-auto rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Collection Details</DialogTitle>
                    <DialogDescription>Applicant and Co-Applicants Information</DialogDescription>
                  </DialogHeader>
                  <CollectionCoApplicantView />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-color-info/10 rounded-lg border border-color-info/20">
                    <Phone className="w-4 h-4 text-color-info" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fg-primary mb-1">Contact Numbers</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(loanDetails.contactNo) ? (
                        loanDetails.contactNo.map((number, index) => (
                          <a
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-color-info/10 text-color-info rounded-lg text-sm hover:bg-color-info/20 transition-colors"
                            href={`tel:${number}`}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            {number}
                          </a>
                        ))
                      ) : (
                        <a
                          className="inline-flex items-center px-3 py-1 bg-color-info/10 text-color-info rounded-lg text-sm hover:bg-color-info/20 transition-colors"
                          href={`tel:${loanDetails.contactNo}`}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          {loanDetails.contactNo || 'N/A'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-color-success/10 rounded-lg border border-color-success/20">
                      <MapPin className="w-4 h-4 text-color-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-fg-primary mb-1">Location</p>
                      <Link
                        target="_blank"
                        className="text-sm text-color-success hover:text-color-success/80 transition-colors hover:underline"
                        to={generateGoogleMapsURL(loanDetails?.latitude, loanDetails?.longitude)}
                      >
                        {loanDetails?.latitude || 'N/A'}, {loanDetails?.longitude || 'N/A'}
                      </Link>
                    </div>
                  </div>

                  {hasPermission(PERMISSIONS.COLLECTION_UPDATE_LOCATION) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-fg-border hover:bg-color-surface-muted">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-xl">
                        <DialogHeader>
                          <DialogTitle>Update Location</DialogTitle>
                          <DialogDescription>Modify the case location coordinates</DialogDescription>
                        </DialogHeader>
                        <UpdateLocationForm
                          caseNo={loanDetails.caseNo}
                          defaultValues={{
                            latitude: loanDetails?.latitude,
                            longitude: loanDetails?.longitude,
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment Chart */}
        {/* <div className="bg-color-surface border border-fg-border rounded-xl p-4">
          <h3 className="text-lg font-semibold text-fg-primary mb-4">Risk Assessment</h3>
          <RadialChartBar hideFooter={false} hideLabel={false} applicantBehaviourScore={70} hideheader={false} />
        </div> */}
      </div>

      {/* Branch Update Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-color-surface rounded-xl shadow-xl border border-fg-border p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-fg-primary mb-4">Confirm Branch Update</h2>
            <div className="space-y-4">
              <div className="p-4 bg-color-surface-muted rounded-lg">
                <p className="text-sm text-fg-secondary">Current Branch</p>
                <p className="text-base font-medium text-fg-primary">{loanDetails?.area}</p>
              </div>
              <div className="p-4 bg-color-primary/10 rounded-lg border border-color-primary/20">
                <p className="text-sm text-fg-secondary">New Branch</p>
                <p className="text-base font-medium text-color-primary">{pendingBranch}</p>
              </div>
              <p className="text-sm text-fg-secondary">
                Are you sure you want to update the branch? This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={confirmBranchUpdate}
                  className="flex-1 bg-color-primary text-fg-inverse hover:bg-color-primary-light"
                >
                  Confirm Update
                </Button>
                <Button
                  onClick={cancelBranchUpdate}
                  variant="outline"
                  className="flex-1 border-fg-border hover:bg-color-surface-muted"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSection;
