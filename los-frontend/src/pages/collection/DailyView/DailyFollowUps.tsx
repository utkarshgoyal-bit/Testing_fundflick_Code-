import { RTable } from '@/components/shared/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BEHAVIOUR, VISIT_TYPE_OPTIONS } from '@/constants/constants';
import { formatDate } from '@/helpers/dateFormater';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { buildOrgRoute } from '@/helpers/routeHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { COMMIT_STATUS_ORDER, ROUTES } from '@/lib/enums';
import { multiSelectStyle } from '@/lib/utils';
import { FETCH_BRANCHES_DATA, FETCH_USERS_DATA } from '@/redux/actions/types';
import { resetFilters, setFilter, setPage } from '@/redux/slices/collection/folllowUpSlice';
import { RootState } from '@/redux/store';
import { EXPORT_COLLECTION_FOLLOWUP_BY_DATE, FETCH_COLLECTION_FOLLOWUP_BY_DATE } from '@/redux/store/actionTypes';
import { ColumnDef } from '@tanstack/react-table';
import debounce from 'debounce';

import {
  Folder,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  Building,
  Users,
  MessageCircle,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  X,
  MapPin,
  Download,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import moment from 'moment';
import Multiselect from 'multiselect-react-dropdown';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import 'react-modern-drawer/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
const DailyFollowups = ({ withoutFilters }: { withoutFilters?: boolean }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const p2pDate = searchParams.get('p2pDate');
  const type = urlQueryParams('type');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { tableConfiguration } = useSelector((state: RootState) => state.FollowUpsliceDetails);
  const { data, page, total, filters } = tableConfiguration;
  const { userId, caseNo } = useParams();
  const {
    tableConfiguration: { data: branchesData },
  } = useSelector((state: RootState) => state.branch);
  const {
    tableConfiguration: { data: usersData },
  } = useSelector((state: RootState) => state.userManagement);

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      caseId: '',
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      type: filters.type || 'date',
      attitude: filters.attitude || 'none',
      visitType: filters.visitType || 'none',
      branch: filters.branch || '',
      createdBy: filters.followupBy || '',
    },
  });

  const statusTitle = {
    [COMMIT_STATUS_ORDER.expired]: 'Expired',
    [COMMIT_STATUS_ORDER.pending]: 'Pending',
    [COMMIT_STATUS_ORDER.fulfilled]: 'Full Field',
  };

  const navigateToFileDetails = (caseNo: string) => {
    navigate(buildOrgRoute(`${ROUTES.COLLECTION}/loan-details/${caseNo}`));
  };

  const getAttitudeColor = (attitude: string) => {
    switch (attitude?.toLowerCase()) {
      case 'polite':
        return 'bg-color-success/10 text-color-success border-color-success/20';
      case 'rude':
        return 'bg-color-error/10 text-color-error border-color-error/20';
      case 'medium':
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      case 'noreply':
        return 'bg-color-surface-muted text-fg-secondary border-fg-border';
      default:
        return 'bg-color-surface-muted text-fg-secondary border-fg-border';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case COMMIT_STATUS_ORDER.fulfilled:
        return 'bg-color-success/10 text-color-success border-color-success/20';
      case COMMIT_STATUS_ORDER.pending:
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      case COMMIT_STATUS_ORDER.expired:
        return 'bg-color-error/10 text-color-error border-color-error/20';
      default:
        return 'bg-color-surface-muted text-fg-secondary border-fg-border';
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'caseId',
      header: () => <div className="text-center font-medium">Case ID</div>,
      cell: (props) => (
        <Button
          variant="ghost"
          className="text-color-primary hover:text-color-primary-light font-medium"
          onClick={() => navigateToFileDetails(props.row.original?.refCaseId?.caseNo)}
        >
          {props.row.original?.refCaseId?.caseNo?.toUpperCase()}
        </Button>
      ),
      minSize: 120,
    },
    {
      accessorKey: 'customerName',
      header: () => <div className="text-center font-medium">Customer</div>,
      cell: (props) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-fg-tertiary" />
          <span className="text-fg-primary">{props.row.original?.refCaseId?.customer}</span>
        </div>
      ),
    },
    {
      accessorKey: 'area',
      header: () => <div className="text-center font-medium">Branch</div>,
      cell: (props) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-color-secondary" />
          <span className="text-fg-primary">{props.row.original?.refCaseId?.area}</span>
        </div>
      ),
    },
    {
      accessorKey: 'attitude',
      header: () => <div className="text-center font-medium">Attitude</div>,
      minSize: 120,
      cell: (props) => (
        <div
          className={`px-3 py-1 rounded-full text-xs flex justify-center font-medium border ${getAttitudeColor(props.row.original.attitude)}`}
        >
          {props?.row?.original?.attitude?.toUpperCase() || 'NA'}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => <div className="text-center font-medium">Date</div>,
      cell: (props) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-fg-tertiary" />
          <span className="text-fg-primary text-sm">
            {formatDate(props.row.original?.createdAt)}
            {/* {convert24to12(props.row.original?.createdAt.split('T')[1])} */}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'commit',
      header: () => <div className="text-center font-medium">P2P Date</div>,
      minSize: 120,
      cell: (props) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-color-accent" />
          <span className="text-fg-primary text-sm">{formatDate(props.row.original.commit)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'remarks',
      header: () => <div className="text-center font-medium">Remarks</div>,
      cell: (props) => (
        <div className="max-w-[200px] truncate text-fg-secondary text-sm" title={props.row.original.remarks}>
          {props.row.original.remarks}
        </div>
      ),
    },
    {
      accessorKey: 'visitType',
      header: () => <div className="text-center font-medium">Visit Type</div>,
      cell: (props) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-color-info" />
          <span className="text-fg-primary text-sm">{props.row.original.visitType.toUpperCase()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-center font-medium">Status</div>,
      cell: (props) => (
        <div
          className={`px-3 py-1 rounded-full flex justify-center text-xs font-medium border ${getStatusColor(props.row.original.commitStatus)}`}
        >
          {statusTitle[props.row.original.commitStatus as keyof typeof statusTitle] || 'NA'}
        </div>
      ),
    },
    {
      accessorKey: 'creator',
      header: () => <div className="text-center font-medium">Follow Up By</div>,
      cell: (props) => {
        const { firstName, lastName } = props.row.original?.createdBy || {};
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-color-primary/10 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-color-primary" />
            </div>
            <span className="text-fg-primary text-sm">
              {firstName || ''} {lastName || ''}
            </span>
          </div>
        );
      },
    },
  ];

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const onSubmit = (data: any) => {
    dispatch(
      setFilter({
        caseId: data.caseId,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        attitude: data.attitude,
        visitType: data.visitType,
        branch: data.branch,
        createdBy: data.createdBy && data.createdBy?.map((item: any) => item.value),
      })
    );
    setIsExpanded(false);
  };

  const clearFilters = () => {
    dispatch(resetFilters());
    reset();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    dispatch({ type: FETCH_COLLECTION_FOLLOWUP_BY_DATE, payload: { userId } });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const applyP2PDateFilter = useCallback(
    (p2pDate: string | null) => {
      let startDate = '';
      let endDate = '';
      const today = moment();
      if (p2pDate === 'today') {
        startDate = today.format('YYYY-MM-DD');
        endDate = startDate;
      } else if (p2pDate === 'yesterday') {
        const yesterday = today.clone().subtract(1, 'day');
        startDate = yesterday.format('YYYY-MM-DD');
        endDate = startDate;
      }
      dispatch(
        setFilter({
          ...filters,
          startDate,
          endDate,
          type: 'commit',
        })
      );
      setValue('startDate', startDate);
      setValue('endDate', endDate);
      setValue('type', 'commit');
    },
    [dispatch, filters]
  );

  const debouncedSetFilter = useCallback(
    debounce((value: string) => {
      dispatch(
        setFilter({
          ...filters,
          caseId: value,
        })
      );
    }, 500),
    [dispatch, filters]
  );

  const handleSearchChanges = (value: string) => {
    setValue('caseId', value);
    debouncedSetFilter(value);
  };

  // Calculate active filters count
  const activeFiltersCount = [
    filters.caseId,
    filters.startDate,
    filters.endDate,
    filters.attitude && filters.attitude !== 'none',
    filters.visitType && filters.visitType !== 'none',
    filters.branch,
    filters.createdBy,
  ].filter(Boolean).length;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [page, filters, userId]);

  useEffect(() => {
    if (p2pDate) {
      applyP2PDateFilter(p2pDate);
    } else if (type == 'commit') {
      const today = moment().format('YYYY-MM-DD');
      dispatch(
        setFilter({
          startDate: today,
          endDate: today,
          type: type,
        })
      );
    }
  }, [type, p2pDate]);

  useEffect(() => {
    dispatch({ type: FETCH_BRANCHES_DATA });
    dispatch({ type: FETCH_USERS_DATA, payload: { silent: true } });
  }, []);
  useEffect(() => {
    handleRefresh();
  }, [page, filters, userId]);
  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      {!withoutFilters && (
        <div className="w-full">
          {/* Main Filter Bar */}
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-6 shadow-sm overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              {/* <div className="absolute top-0 right-0 w-20 h-20 bg-color-primary rounded-full -translate-y-10 translate-x-10"></div> */}
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-color-secondary rounded-full translate-y-8 -translate-x-8"></div>
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
              {/* Search and Actions Row */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                {/* Search Section */}
                <div className="flex-1 relative">
                  <Controller
                    name="caseId"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-tertiary" />
                        <Input
                          type="text"
                          disabled={(caseNo?.length || 0) > 0}
                          placeholder="Search by case ID or customer name..."
                          className="pl-10 bg-color-surface border-fg-border focus:border-color-primary/50 h-12"
                          value={field.value}
                          onChange={(e) => handleSearchChanges(e.target.value)}
                        />
                      </>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="border-fg-border hover:bg-color-surface-muted h-12 px-4"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="border-fg-border hover:bg-color-surface-muted h-12 px-4"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 bg-color-primary text-fg-on-accent text-xs px-2 py-1 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </Button>

                  {hasPermission(PERMISSIONS.COLLECTION_EXPORT_DATA) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch({ type: EXPORT_COLLECTION_FOLLOWUP_BY_DATE })}
                      className="border-fg-border hover:bg-color-surface-muted h-12 px-4"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.caseId && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-color-primary/10 text-color-primary rounded-full text-sm border border-color-primary/20">
                      <FileText className="h-3 w-3" />
                      <span>Case: {filters.caseId}</span>
                      <button
                        onClick={() => {
                          setValue('caseId', '');
                          debouncedSetFilter('');
                        }}
                        className="hover:bg-color-primary/20 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {(filters.startDate || filters.endDate) && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-color-accent/10 text-color-accent rounded-full text-sm border border-color-accent/20">
                      <Calendar className="h-3 w-3" />
                      <span>Date Range</span>
                      <button
                        onClick={() => {
                          setValue('startDate', '');
                          setValue('endDate', '');
                        }}
                        className="hover:bg-color-accent/20 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {filters.attitude && filters.attitude !== 'none' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-color-secondary/10 text-color-secondary rounded-full text-sm border border-color-secondary/20">
                      <User className="h-3 w-3" />
                      <span>Attitude: {filters.attitude}</span>
                      <button
                        onClick={() => setValue('attitude', 'none')}
                        className="hover:bg-color-secondary/20 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {filters.visitType && filters.visitType !== 'none' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-color-info/10 text-color-info rounded-full text-sm border border-color-info/20">
                      <MapPin className="h-3 w-3" />
                      <span>Visit: {filters.visitType}</span>
                      <button
                        onClick={() => setValue('visitType', 'none')}
                        className="hover:bg-color-info/20 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Expandable Filter Panel */}
          {isExpanded && (
            <div className="mt-4 bg-color-surface border border-fg-border rounded-lg p-6 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                      <Calendar className="h-4 w-4 text-color-primary" />
                      From Date
                    </Label>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="date"
                          className="bg-color-surface border-fg-border focus:border-color-primary/50 h-12"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                      <Calendar className="h-4 w-4 text-color-primary" />
                      To Date
                    </Label>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="date"
                          className="bg-color-surface border-fg-border focus:border-color-primary/50 h-12"
                          min={filters.startDate}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Date Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-fg-primary">Date Type</Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) => setValue('type', value)}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-3 p-3 bg-color-surface-muted/50 rounded-lg">
                          <RadioGroupItem value="date" id="date" />
                          <Label htmlFor="date" className="font-medium text-fg-primary cursor-pointer">
                            Voucher Date
                          </Label>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-color-surface-muted/50 rounded-lg">
                          <RadioGroupItem value="commit" id="commit" />
                          <Label htmlFor="commit" className="font-medium text-fg-primary cursor-pointer">
                            P2P Date
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                      <User className="h-4 w-4 text-color-secondary" />
                      Attitude
                    </Label>
                    <Controller
                      name="attitude"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={(value) => setValue('attitude', value)}>
                          <SelectTrigger className="bg-color-surface border-fg-border h-12">
                            <SelectValue placeholder="Select Attitude" />
                          </SelectTrigger>
                          <SelectContent className="bg-color-surface border-fg-border">
                            {BEHAVIOUR.map(({ name, value }) => (
                              <SelectItem key={value} value={value} className="hover:bg-color-surface-muted">
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                      <MapPin className="h-4 w-4 text-color-info" />
                      Visit Type
                    </Label>
                    <Controller
                      name="visitType"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={(value) => setValue('visitType', value)}>
                          <SelectTrigger className="bg-color-surface border-fg-border h-12">
                            <SelectValue placeholder="Select Visit Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-color-surface border-fg-border">
                            {VISIT_TYPE_OPTIONS.map(({ name, value }) => (
                              <SelectItem key={value} value={value} className="hover:bg-color-surface-muted">
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                      <Building className="h-4 w-4 text-color-accent" />
                      Branch
                    </Label>
                    <Controller
                      name="branch"
                      control={control}
                      render={({ field }) => (
                        <Multiselect
                          options={branchesData.map((branch: any) => branch.name)}
                          isObject={false}
                          showCheckbox={true}
                          closeOnSelect={false}
                          avoidHighlightFirstOption
                          onSelect={(value) => setValue('branch', value)}
                          onRemove={(value) => setValue('branch', value)}
                          placeholder="Select Branch"
                          selectedValues={field.value}
                          style={{
                            ...multiSelectStyle,
                            searchBox: {
                              ...multiSelectStyle.searchBox,
                              backgroundColor: 'var(--color-surface)',
                              border: '1px solid var(--fg-border)',
                              color: 'var(--fg-primary)',
                            },
                            chips: {
                              ...multiSelectStyle.chips,
                              backgroundColor: 'var(--color-primary)',
                              color: 'var(--fg-on-accent)',
                            },
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                      <Users className="h-4 w-4 text-color-warning" />
                      Follow-up By
                    </Label>
                    <Controller
                      name="createdBy"
                      control={control}
                      render={({ field }) => (
                        <Multiselect
                          options={usersData.map((user: any) => ({ label: user.name, value: user.employeeId }))}
                          showCheckbox={true}
                          closeOnSelect={false}
                          avoidHighlightFirstOption
                          onSelect={(value) => setValue('createdBy', value)}
                          onRemove={(value) => setValue('createdBy', value)}
                          placeholder="Select User"
                          displayValue="label"
                          selectedValues={field.value}
                          style={{
                            ...multiSelectStyle,
                            searchBox: {
                              ...multiSelectStyle.searchBox,
                              backgroundColor: 'var(--color-surface)',
                              border: '1px solid var(--fg-border)',
                              color: 'var(--fg-primary)',
                            },
                            chips: {
                              ...multiSelectStyle.chips,
                              backgroundColor: 'var(--color-primary)',
                              color: 'var(--fg-on-accent)',
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-fg-border">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    type="button"
                    className="border-fg-border hover:bg-color-surface-muted"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  <Button type="submit" className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Statistics Card */}
      {!!data?.length && (
        <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 right-0 w-12 h-12 bg-color-primary rounded-full -translate-y-6 translate-x-6"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-color-primary/10 rounded-lg">
                  <Folder className="h-5 w-5 text-color-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-fg-primary">Total Follow-ups</h3>
                  <p className="text-sm text-fg-secondary">Records found for current filters</p>
                </div>
              </div>
              {/* <div className="text-2xl font-bold text-color-primary">{total}</div> */}
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!!data?.length && (
        <div className="bg-color-surface border border-fg-border rounded-lg overflow-hidden">
          <RTable
            pinnedColumns={windowWidth < 800 ? { left: ['caseId'] } : {}}
            columns={columns}
            data={data}
            handlePageChange={handlePageChange}
            page={page}
            total={total}
          />
        </div>
      )}

      {/* Empty State */}
      {!data?.length && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto bg-color-surface-muted rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-fg-tertiary" />
            </div>
            <h3 className="text-lg font-semibold text-fg-primary mb-2">No Follow-ups Found</h3>
            <p className="text-fg-secondary">
              No follow-up records match your current criteria. Try adjusting your search or filters.
            </p>
          </div>
        </div>
      )}

      {/* Case Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-color-surface border-fg-border">
          <DialogHeader>
            <DialogTitle className="text-fg-primary">Case Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">{/* Add your dialog content here */}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyFollowups;
