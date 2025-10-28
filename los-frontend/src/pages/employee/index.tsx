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
import PageHeader from '@/components/shared/pageHeader';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { ROUTES } from '@/lib/enums';
import { IEmployeeTable } from '@/lib/interfaces/tables';
import { cn } from '@/lib/utils';

import { BLOCK_EMPLOYEES_DATA, FETCH_EMPLOYEES_DATA, UNBLOCK_EMPLOYEES_DATA } from '@/redux/actions/types';
// import { setTableFilters } from '@/redux/slices/users';
import { RootState } from '@/redux/store';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import {
  Calendar,
  CircleOff,
  Edit,
  Eye,
  Grid,
  List,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  User,
  Users,
  UserCheck,
  Crown,
  Briefcase,
  Star,
  RefreshCw,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { getOrganizationSettings } from '@/redux/slices/organizationConfigs/fetchOrganizationConfigs';


type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'date' | 'designation' | 'status';
type FilterOption = 'all' | 'active' | 'inactive';

export default function EmployeeManagement() {
  const orgSettings = useSelector(getOrganizationSettings);
  const timezone = orgSettings?.timezone || 'Asia/Kolkata';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tableConfiguration, loading } = useSelector((state: RootState) => state.employee);
  // const { data, page, total, sort } = tableConfiguration;
  const { data } = tableConfiguration;

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployeeTable | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onEditEmployeeHandler = ({ route, id }: { route: string; id: string }) => {
    navigate({
      pathname: route,
      search: `?edit=true&id=${id}`,
    });
  };

  const onEmployeeStatusHandler = ({ type, id }: { type: string; id: string }) => {
    if (!id) return;
    dispatch({ type, payload: { id } });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    dispatch({ type: FETCH_EMPLOYEES_DATA });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleViewEmployee = (employee: IEmployeeTable) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const getDesignationIcon = (designation: string) => {
    const des = designation?.toLowerCase() || '';
    if (des.includes('manager')) return <Crown className="h-4 w-4 text-color-primary" />;
    if (des.includes('head')) return <UserCheck className="h-4 w-4 text-color-info" />;
    if (des.includes('officer')) return <Briefcase className="h-4 w-4 text-color-secondary" />;
    if (des.includes('executive')) return <Star className="h-4 w-4 text-color-accent" />;
    return <User className="h-4 w-4 text-color-secondary" />;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-color-success/10 text-color-success border-color-success/20'
      : 'bg-color-error/10 text-color-error border-color-error/20';
  };

  const getEmployeeInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...(data || [])]; // Create a copy of the array

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((employee: IEmployeeTable) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          employee.firstName?.toLowerCase().includes(searchLower) ||
          employee.lastName?.toLowerCase().includes(searchLower) ||
          employee.email?.toLowerCase().includes(searchLower) ||
          employee.designation?.toLowerCase().includes(searchLower) ||
          employee.mobile?.includes(searchTerm)
        );
      });
    }

    // Apply status filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((employee: IEmployeeTable) => {
        if (filterBy === 'active') return employee.isActive;
        if (filterBy === 'inactive') return !employee.isActive;
        return true;
      });
    }

    // Apply sorting (now safe to sort since we have a copy)
    return filtered.sort((a: IEmployeeTable, b: IEmployeeTable) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'designation':
          return (a.designation || '').localeCompare(b.designation || '');
        case 'status':
          return b.isActive === a.isActive ? 0 : b.isActive ? 1 : -1;
        default:
          return 0;
      }
    });
  }, [data, searchTerm, filterBy, sortBy]);

  const stats = useMemo(() => {
    const total = data?.length || 0;
    const active = data?.filter((emp: IEmployeeTable) => emp.isActive).length || 0;
    const inactive = total - active;

    return { total, active, inactive };
  }, [data]);

  // const handlePageChange = (page: number) => {
  //   dispatch(setTableFilters({ ...tableConfiguration, page }));
  // };

  useEffect(() => {
    dispatch({ type: FETCH_EMPLOYEES_DATA });
  }, [dispatch]);

  const renderEmployeeCard = (employee: IEmployeeTable) => (
    <Card
      key={employee._id}
      className="group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-color-surface/80 backdrop-blur-sm"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-color-primary/3 via-transparent to-color-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-semibold">
                {getEmployeeInitials(employee.firstName, employee.lastName)}
              </div>
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                  employee.isActive ? 'bg-color-success' : 'bg-color-error'
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-color-primary truncate">
                {employee.firstName} {employee.lastName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getDesignationIcon(employee.designation)}
                <CardDescription className="text-sm text-fg-secondary truncate">
                  {employee.designation || 'Not specified'}
                </CardDescription>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge variant="outline" className={cn('text-xs', getStatusColor(employee.isActive))}>
              {employee.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-color-info" />
            <span className="text-fg-secondary truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-color-success" />
            <span className="text-fg-secondary">{employee.mobile}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-color-warning" />
            <span className="text-fg-secondary truncate">
              {employee.addressLine1}, {employee.state}, {employee.country}
            </span>
          </div>
        </div>

        <Separator className="bg-fg-border/30" />

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-color-accent" />
            <span className="text-fg-secondary">Joined {moment(employee.joiningDate).tz(timezone).format('MMM DD, YYYY')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-fg-tertiary">ID: {employee.eId}</span>
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
                    onClick={() => handleViewEmployee(employee)}
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

            {hasPermission(PERMISSIONS.EMPLOYEE_UPDATE) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onEditEmployeeHandler({
                          route: buildOrgRoute(ROUTES.EMPLOYEE_MANAGEMENT_REGISTER),
                          id: employee._id,
                        })
                      }
                      className="h-8 w-8 p-0 text-color-secondary hover:bg-color-secondary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Employee</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center gap-2">
            {employee.isActive && hasPermission(PERMISSIONS.EMPLOYEE_BLOCK) ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onEmployeeStatusHandler({
                          type: BLOCK_EMPLOYEES_DATA,
                          id: employee._id,
                        })
                      }
                      className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
                    >
                      <CircleOff className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Block Employee</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              hasPermission(PERMISSIONS.EMPLOYEE_UNBLOCK) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onEmployeeStatusHandler({
                            type: UNBLOCK_EMPLOYEES_DATA,
                            id: employee._id,
                          })
                        }
                        className="h-8 w-8 p-0 text-color-success hover:bg-color-success/10"
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unblock Employee</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmployeeListItem = (employee: IEmployeeTable) => (
    <Card
      key={employee._id}
      className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-color-surface/80 backdrop-blur-sm"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-semibold text-sm">
                {getEmployeeInitials(employee.firstName, employee.lastName)}
              </div>
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
                  employee.isActive ? 'bg-color-success' : 'bg-color-error'
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-color-primary truncate">
                  {employee.firstName} {employee.lastName}
                </span>
                <Badge variant="outline" className={cn('text-xs', getStatusColor(employee.isActive))}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-fg-secondary">
                <div className="flex items-center gap-1">
                  {getDesignationIcon(employee.designation)}
                  <span className="truncate">{employee.designation || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{employee.mobile}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{moment(employee.createdAt).format('MMM DD, YYYY')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleViewEmployee(employee)}
              className="h-8 w-8 p-0 text-color-info hover:bg-color-info/10"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {hasPermission(PERMISSIONS.EMPLOYEE_UPDATE) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  onEditEmployeeHandler({
                    route: buildOrgRoute(ROUTES.EMPLOYEE_MANAGEMENT_REGISTER),
                    id: employee._id,
                  })
                }
                className="h-8 w-8 p-0 text-color-secondary hover:bg-color-secondary/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {employee.isActive && hasPermission(PERMISSIONS.EMPLOYEE_BLOCK) ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  onEmployeeStatusHandler({
                    type: BLOCK_EMPLOYEES_DATA,
                    id: employee._id,
                  })
                }
                className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
              >
                <CircleOff className="h-4 w-4" />
              </Button>
            ) : (
              hasPermission(PERMISSIONS.EMPLOYEE_UNBLOCK) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onEmployeeStatusHandler({
                      type: UNBLOCK_EMPLOYEES_DATA,
                      id: employee._id,
                    })
                  }
                  className="h-8 w-8 p-0 text-color-success hover:bg-color-success/10"
                >
                  <ShieldCheck className="h-4 w-4" />
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>LOS | Employees</title>
      </Helmet>

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-color-primary/5 via-color-secondary/5 to-color-accent/5 rounded-2xl -z-10" />
        <PageHeader
          title="employees"
          subtitle="Manage and oversee all employee information"
          actions={
            <div className="flex items-center gap-2">
              {hasPermission(PERMISSIONS.EMPLOYEE_CREATE) && (
                <Button asChild className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                  <Link to={buildOrgRoute(ROUTES.EMPLOYEE_MANAGEMENT_REGISTER)}>
                    <Plus className="h-4 w-4" />
                    <I8nTextWrapper text="registerNewEmployee" />
                  </Link>
                </Button>
              )}
            </div>
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          onClick={() => setFilterBy('all')}
          className={cn(
            'border-0 shadow-md bg-color-surface/80 backdrop-blur-sm cursor-pointer',
            filterBy === 'all' && 'ring-2 ring-color-error/30'
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Total Employees</p>
                <p className="text-2xl font-bold text-color-primary">{stats.total}</p>
              </div>
              <div className="p-3 bg-color-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-color-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilterBy('active')}
          className={cn(
            'border-0 shadow-md bg-color-surface/80 backdrop-blur-sm cursor-pointer',
            filterBy === 'active' && 'ring-2 ring-color-success/30'
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Active Employees</p>
                <p className="text-2xl font-bold text-color-success">{stats.active}</p>
              </div>
              <div className="p-3 bg-color-success/10 rounded-xl">
                <UserCheck className="h-6 w-6 text-color-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilterBy('inactive')}
          className={cn(
            'border-0 shadow-md bg-color-surface/80 backdrop-blur-sm cursor-pointer',
            filterBy === 'inactive' && 'ring-2 ring-color-error/30'
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Inactive Employees</p>
                <p className="text-2xl font-bold text-color-error">{stats.inactive}</p>
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
                placeholder="Search employees by name, email, or designation..."
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-32 bg-color-surface border-fg-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-color-surface border-fg-border">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Join Date</SelectItem>
                  <SelectItem value="designation">Designation</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
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

      {/* Employee List */}
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
          {filteredAndSortedData.map((employee: IEmployeeTable) =>
            viewMode === 'grid' ? renderEmployeeCard(employee) : renderEmployeeListItem(employee)
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedData.length === 0 && (
        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-fg-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-color-primary mb-2">
              {searchTerm || filterBy !== 'all' ? 'No employees found' : 'No employees yet'}
            </h3>
            <p className="text-fg-secondary mb-4">
              {searchTerm || filterBy !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first employee to the system'}
            </p>
            {hasPermission(PERMISSIONS.EMPLOYEE_CREATE) && (
              <Button asChild className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                <Link to={buildOrgRoute(ROUTES.EMPLOYEE_MANAGEMENT_REGISTER)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Employee Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl bg-color-surface border-fg-border">
          <DialogHeader>
            <DialogTitle className="text-color-primary">Employee Details</DialogTitle>
            <DialogDescription className="text-fg-secondary">
              Complete information about the selected employee
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-bold text-lg">
                    {getEmployeeInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-color-primary">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h3>
                    <p className="text-fg-secondary">{selectedEmployee.designation}</p>
                    <Badge variant="outline" className={cn('mt-1', getStatusColor(selectedEmployee.isActive))}>
                      {selectedEmployee.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold text-color-primary mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-fg-secondary">Email</Label>
                      <p className="text-fg-primary">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Phone</Label>
                      <p className="text-fg-primary">{selectedEmployee.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-semibold text-color-primary mb-3">Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-fg-secondary">Address Line 1</Label>
                      <p className="text-fg-primary">{selectedEmployee.addressLine1}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Address Line 2</Label>
                      <p className="text-fg-primary">{selectedEmployee.addressLine2 || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">State</Label>
                      <p className="text-fg-primary">{selectedEmployee.state}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Country</Label>
                      <p className="text-fg-primary">{selectedEmployee.country}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="font-semibold text-color-primary mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-fg-secondary">Employee ID</Label>
                      <p className="text-fg-primary">{selectedEmployee.eId}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Date of Birth</Label>
                      <p className="text-fg-primary">
                        {selectedEmployee.dob ? moment(Number(selectedEmployee.dob)).tz(timezone).format('DD/MM/YYYY') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Gender</Label>
                      <p className="text-fg-primary">{selectedEmployee.sex || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Marital Status</Label>
                      <p className="text-fg-primary">{selectedEmployee.maritalStatus || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Qualification</Label>
                      <p className="text-fg-primary">{selectedEmployee.qualification || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Join Date</Label>
                      <p className="text-fg-primary">{moment(selectedEmployee.joiningDate).tz(timezone).format('DD/MM/YYYY')}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="font-semibold text-color-primary mb-3">Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-fg-secondary">PAN</Label>
                      <p className="text-fg-primary">{selectedEmployee.pan || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Aadhar (UID)</Label>
                      <p className="text-fg-primary">{selectedEmployee.uid || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Passport</Label>
                      <p className="text-fg-primary">{selectedEmployee.passport || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Voter ID</Label>
                      <p className="text-fg-primary">{selectedEmployee.voterID || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Driving License</Label>
                      <p className="text-fg-primary">{selectedEmployee.drivingLicense || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
