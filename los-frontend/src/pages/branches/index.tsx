import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { ROUTES } from '@/lib/enums';
import { IBranchTable } from '@/lib/interfaces/tables';
import { cn } from '@/lib/utils';
// import { setTableFilters } from '@/redux/slices/branches';
import PageHeader from '@/components/shared/pageHeader';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { BLOCK_BRANCH_DATA, DELETE_BRANCH, FETCH_BRANCHES_DATA, UNBLOCK_BRANCH_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import {
  Building,
  Calendar,
  CircleOff,
  Edit,
  Eye,
  Grid,
  List,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Trash,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'city' | 'state' | 'country' | 'date';
type FilterOption = 'all' | 'active' | 'blocked';

export default function BranchManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tableConfiguration, loading } = useSelector((state: RootState) => state.branch);
  // const { data, page, total, sort } = tableConfiguration;
  const { data } = tableConfiguration;

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedBranch, setSelectedBranch] = useState<IBranchTable | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleEditBranch = (id: string) => {
    navigate({
      pathname: buildOrgRoute(ROUTES.BRANCH_MANAGEMENT_REGISTER),
      search: `?edit=true&id=${id}`,
    });
  };

  const handleBranchStatusToggle = (id: string, isActive: boolean) => {
    const action = isActive ? BLOCK_BRANCH_DATA : UNBLOCK_BRANCH_DATA;
    dispatch({ type: action, payload: { id } });
  };

  const handleDeleteBranch = (id: string) => {
    dispatch({ type: DELETE_BRANCH, payload: { id } });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    dispatch({ type: FETCH_BRANCHES_DATA });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleViewBranch = (branch: IBranchTable) => {
    setSelectedBranch(branch);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-color-success/10 text-color-success border-color-success/20'
      : 'bg-color-error/10 text-color-error border-color-error/20';
  };

  const getBranchInitials = (name: string) => {
    return (
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'BR'
    );
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...(data || [])];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((branch: IBranchTable) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          branch.name?.toLowerCase().includes(searchLower) ||
          branch.city?.toLowerCase().includes(searchLower) ||
          branch.state?.toLowerCase().includes(searchLower) ||
          branch.country?.toLowerCase().includes(searchLower) ||
          branch.landMark?.toLowerCase().includes(searchLower) ||
          branch.postalCode?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((branch: IBranchTable) => {
        if (filterBy === 'active') return branch.isActive;
        if (filterBy === 'blocked') return !branch.isActive;
        return true;
      });
    }

    // Apply sorting
    return filtered.sort((a: IBranchTable, b: IBranchTable) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'city':
          return (a.city || '').localeCompare(b.city || '');
        case 'state':
          return (a.state || '').localeCompare(b.state || '');
        case 'country':
          return (a.country || '').localeCompare(b.country || '');
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [data, searchTerm, filterBy, sortBy]);

  const stats = useMemo(() => {
    const total = data?.length || 0;
    const active = data?.filter((branch: IBranchTable) => branch.isActive).length || 0;
    const blocked = total - active;

    return { total, active, blocked };
  }, [data]);

  // const handlePageChange = (page: number) => {
  //   dispatch(setTableFilters({ ...tableConfiguration, page }));
  // };

  useEffect(() => {
    dispatch({ type: FETCH_BRANCHES_DATA });
  }, [dispatch]);

  const renderBranchCard = (branch: IBranchTable) => (
    <Card
      key={branch._id}
      className="group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-color-surface/80 backdrop-blur-sm"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-color-primary/3 via-transparent to-color-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-semibold">
                {getBranchInitials(branch.name)}
              </div>
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                  branch.isActive ? 'bg-color-success' : 'bg-color-error'
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-color-primary truncate">{branch.name}</CardTitle>
              <CardDescription className="text-sm text-fg-secondary truncate">
                {branch.city}, {branch.state}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge variant="outline" className={cn('text-xs', getStatusColor(branch.isActive))}>
              {branch.isActive ? 'Active' : 'Blocked'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Branch Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-color-info" />
            <span className="text-fg-secondary truncate">{branch.landMark}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-color-warning" />
            <span className="text-fg-secondary">
              {branch.city}, {branch.state} - {branch.postalCode}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4 text-color-accent" />
            <span className="text-fg-secondary">{branch.country}</span>
          </div>
        </div>

        <Separator className="bg-fg-border/30" />

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-color-accent" />
            <span className="text-fg-secondary">Created {moment(branch.createdAt).format('MMM DD, YYYY')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewBranch(branch)}
                    className="h-8 w-8 p-0 text-color-info hover:bg-color-info/10"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {hasPermission(PERMISSIONS.BRANCH_UPDATE) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditBranch(branch._id)}
                      className="h-8 w-8 p-0 text-color-secondary hover:bg-color-secondary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Branch</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center gap-2">
            {branch.isActive && hasPermission(PERMISSIONS.BRANCH_BLOCK) ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleBranchStatusToggle(branch._id, true)}
                      className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
                    >
                      <CircleOff className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Block Branch</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              hasPermission(PERMISSIONS.BRANCH_UNBLOCK) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleBranchStatusToggle(branch._id, false)}
                        className="h-8 w-8 p-0 text-color-success hover:bg-color-success/10"
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unblock Branch</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            )}

            {hasPermission(PERMISSIONS.BRANCH_DELETE) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBranch(branch._id)}
                      className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Branch</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBranchListItem = (branch: IBranchTable) => (
    <Card
      key={branch._id}
      className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-color-surface/80 backdrop-blur-sm"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-semibold text-sm">
                {getBranchInitials(branch.name)}
              </div>
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
                  branch.isActive ? 'bg-color-success' : 'bg-color-error'
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-color-primary truncate">{branch.name}</span>
                <Badge variant="outline" className={cn('text-xs', getStatusColor(branch.isActive))}>
                  {branch.isActive ? 'Active' : 'Blocked'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-fg-secondary">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{branch.landMark}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>
                    {branch.city}, {branch.state}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  <span>{branch.postalCode}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{moment(branch.createdAt).format('MMM DD, YYYY')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleViewBranch(branch)}
              className="h-8 w-8 p-0 text-color-info hover:bg-color-info/10"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {hasPermission(PERMISSIONS.BRANCH_UPDATE) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditBranch(branch._id)}
                className="h-8 w-8 p-0 text-color-secondary hover:bg-color-secondary/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {branch.isActive && hasPermission(PERMISSIONS.BRANCH_BLOCK) ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleBranchStatusToggle(branch._id, true)}
                className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
              >
                <CircleOff className="h-4 w-4" />
              </Button>
            ) : (
              hasPermission(PERMISSIONS.BRANCH_UNBLOCK) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBranchStatusToggle(branch._id, false)}
                  className="h-8 w-8 p-0 text-color-success hover:bg-color-success/10"
                >
                  <ShieldCheck className="h-4 w-4" />
                </Button>
              )
            )}

            {hasPermission(PERMISSIONS.BRANCH_DELETE) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteBranch(branch._id)}
                className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>LOS | Branches</title>
      </Helmet>
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-color-primary/5 via-color-secondary/5 to-color-accent/5 rounded-2xl -z-10" />
        <PageHeader
          title="branches"
          subtitle="Manage company branches and locations"
          actions={
            hasPermission(PERMISSIONS.BRANCH_CREATE) && (
              <Button asChild className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                <Link to={buildOrgRoute(ROUTES.BRANCH_MANAGEMENT_REGISTER)}>
                  <Plus className="h-4 w-4 mr-2" />
                  <I8nTextWrapper text="newBranch" />
                </Link>
              </Button>
            )
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Total Branches</p>
                <p className="text-2xl font-bold text-color-primary">{stats.total}</p>
              </div>
              <div className="p-3 bg-color-primary/10 rounded-xl">
                <Building className="h-6 w-6 text-color-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Active Branches</p>
                <p className="text-2xl font-bold text-color-success">{stats.active}</p>
              </div>
              <div className="p-3 bg-color-success/10 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-color-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Blocked Branches</p>
                <p className="text-2xl font-bold text-color-error">{stats.blocked}</p>
              </div>
              <div className="p-3 bg-color-error/10 rounded-xl">
                <CircleOff className="h-6 w-6 text-color-error" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-tertiary" />
              <Input
                placeholder="Search branches by name, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-color-surface border-fg-border"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                <SelectTrigger className="w-32 bg-color-surface border-fg-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-color-surface border-fg-border">
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-32 bg-color-surface border-fg-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-color-surface border-fg-border">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="date">Created Date</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 border border-fg-border rounded-lg p-1 bg-color-surface">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-fg-border hover:bg-color-surface-muted"
              >
                <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branch List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-color-surface-muted rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-color-surface-muted rounded w-1/3 mb-2" />
                      <div className="h-3 bg-color-surface-muted rounded w-1/2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4')}>
          {filteredAndSortedData.map((branch: IBranchTable) =>
            viewMode === 'grid' ? renderBranchCard(branch) : renderBranchListItem(branch)
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedData.length === 0 && (
        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Building className="h-16 w-16 text-fg-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-color-primary mb-2">
              {searchTerm || filterBy !== 'all' ? 'No branches found' : 'No branches yet'}
            </h3>
            <p className="text-fg-secondary mb-4">
              {searchTerm || filterBy !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first branch to the system'}
            </p>
            {hasPermission(PERMISSIONS.BRANCH_CREATE) && (
              <Button asChild className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                <Link to={buildOrgRoute(ROUTES.BRANCH_MANAGEMENT_REGISTER)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Branch
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Branch Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl bg-color-surface border-fg-border">
          <DialogHeader>
            <DialogTitle className="text-color-primary">Branch Details</DialogTitle>
            <DialogDescription className="text-fg-secondary">
              Complete information about the selected branch
            </DialogDescription>
          </DialogHeader>

          {selectedBranch && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-bold text-lg">
                    {getBranchInitials(selectedBranch.name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-color-primary">{selectedBranch.name}</h3>
                    <p className="text-fg-secondary">
                      {selectedBranch.city}, {selectedBranch.state}
                    </p>
                    <Badge variant="outline" className={cn('mt-1', getStatusColor(selectedBranch.isActive))}>
                      {selectedBranch.isActive ? 'Active' : 'Blocked'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Branch Information */}
                <div>
                  <h4 className="font-semibold text-color-primary mb-3">Branch Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-fg-secondary">Branch Name</Label>
                      <p className="text-fg-primary">{selectedBranch.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">City</Label>
                      <p className="text-fg-primary">{selectedBranch.city}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">State</Label>
                      <p className="text-fg-primary">{selectedBranch.state}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Country</Label>
                      <p className="text-fg-primary">{selectedBranch.country}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Postal Code</Label>
                      <p className="text-fg-primary">{selectedBranch.postalCode}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Created Date</Label>
                      <p className="text-fg-primary">{moment(selectedBranch.createdAt).format('DD/MM/YYYY')}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="font-semibold text-color-primary mb-3">Address Information</h4>
                  <div>
                    <Label className="text-sm text-fg-secondary">Full Address</Label>
                    <p className="text-fg-primary">{selectedBranch.landMark}</p>
                  </div>
                </div>

                {/* Children Information */}
                {selectedBranch.children.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-color-primary mb-3">Children Information</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBranch.children.map((item) => (
                        <p key={item._id} className="border border-fg-border px-2 py-1 rounded-md shadow-lg">
                          {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
