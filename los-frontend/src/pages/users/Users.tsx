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
import { isSuperAdmin } from '@/helpers/checkUserRole';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { ROUTES } from '@/lib/enums';
import { IUserTable } from '@/lib/interfaces/tables';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { BLOCK_USERS_DATA, FETCH_USERS_DATA, UNBLOCK_USERS_DATA } from '@/redux/store/actionTypes';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import {
  Building,
  Calendar,
  CircleOff,
  CreditCard,
  Crown,
  Edit,
  Eye,
  Grid,
  List,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
  Users2,
  Wallet,
  Zap,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LedgerBalance from './ledger';
import PageHeader from '@/components/shared/pageHeader';
import { buildOrgRoute } from '@/helpers/routeHelper';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'email' | 'role' | 'balance' | 'date' | 'isActive';
type FilterOption = 'all' | 'active' | 'blocked';

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tableConfiguration, loading } = useSelector((state: RootState) => state.userManagement);
  const { role, data: loginUser } = useSelector((state: RootState) => state.login);
  const { data } = tableConfiguration;

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('isActive');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedUser, setSelectedUser] = useState<IUserTable | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleEditUser = (id: string) => {
    navigate({
      pathname: buildOrgRoute(ROUTES.USER_MANAGEMENT_REGISTER),
      search: `?edit=true&id=${id}`,
    });
  };

  const handleUserStatusToggle = (id: string, isActive: boolean) => {
    const action = isActive ? BLOCK_USERS_DATA : UNBLOCK_USERS_DATA;
    dispatch({ type: action, payload: { id } });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const isBlocked = filterBy === 'blocked' ? { isBlocked: true } : filterBy == 'all' ? {} : { isBlocked: false };

    dispatch({ type: FETCH_USERS_DATA, payload: isBlocked });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleViewUser = (user: IUserTable) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleViewLedger = (user: IUserTable) => {
    setSelectedUser(user);
    setIsLedgerOpen(true);
  };

  const getRoleIcon = (roleName: string) => {
    const role = roleName?.toLowerCase() || '';
    if (role.includes('admin')) return <Crown className="h-4 w-4 text-color-error" />;
    if (role.includes('manager')) return <Shield className="h-4 w-4 text-color-primary" />;
    if (role.includes('head')) return <UserCheck className="h-4 w-4 text-color-info" />;
    if (role.includes('collection')) return <Zap className="h-4 w-4 text-color-success" />;
    return <User className="h-4 w-4 text-color-secondary" />;
  };

  const renderUserCard = (user: IUserTable) => (
    <Card
      key={user._id}
      className="group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-color-surface/80 backdrop-blur-sm"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-color-primary/3 via-transparent to-color-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-semibold">
                {getUserInitials(user.name || user.employeeId)}
              </div>
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                  user.isActive ? 'bg-color-success' : 'bg-color-error'
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-color-primary truncate">
                {user.name || user.employeeId}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getRoleIcon(user.roleRef?.name)}
                <CardDescription className="text-sm text-fg-secondary truncate">
                  {user.roleRef?.name || 'No role assigned'}
                </CardDescription>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge variant="outline" className={cn('text-xs', getStatusColor(user.isActive))}>
              {user.isActive ? 'Active' : 'Blocked'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* User Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-color-info" />
            <span className="text-fg-secondary truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wallet className="h-4 w-4 text-color-success" />
            <span className="text-fg-secondary">Balance: ₹{user.ledgerBalance || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-color-warning" />
            <span className="text-fg-secondary truncate">
              {Array.isArray(user.branches) ? user.branches.join(', ') : user.branches || 'No branches'}
            </span>
          </div>
        </div>

        <Separator className="bg-fg-border/30" />

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-color-accent" />
            <span className="text-fg-secondary">Joined {moment(user.createdAt).format('MMM DD, YYYY')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-fg-tertiary">ID: {user.employeeId}</span>
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
                    onClick={() => handleViewUser(user)}
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

            {user.ledgerBalance && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewLedger(user)}
                      className="h-8 w-8 p-0 text-color-success hover:bg-color-success/10"
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Ledger</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {hasPermission(PERMISSIONS.USER_UPDATE) && user._id !== loginUser?.user._id && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditUser(user._id)}
                      className="h-8 w-8 p-0 text-color-secondary hover:bg-color-secondary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit User</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {user.role !== 'Super Admin' && user._id !== loginUser?.user._id && (
            <div className="flex items-center gap-2">
              {user.isActive && hasPermission(PERMISSIONS.USER_BLOCK) ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUserStatusToggle(user._id, true)}
                        className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
                      >
                        <CircleOff className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Block User</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                hasPermission(PERMISSIONS.USER_UNBLOCK) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUserStatusToggle(user._id, false)}
                          className="h-8 w-8 p-0 text-color-success hover:bg-color-success/10"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Unblock User</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderUserListItem = (user: IUserTable) => (
    <Card
      key={user._id}
      className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-color-surface/80 backdrop-blur-sm"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-semibold text-sm">
                {getUserInitials(user.name || user.employeeId)}
              </div>
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
                  user.isActive ? 'bg-color-success' : 'bg-color-error'
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-color-primary truncate">{user.name || user.employeeId}</span>
                <Badge variant="outline" className={cn('text-xs', getStatusColor(user.isActive))}>
                  {user.isActive ? 'Active' : 'Blocked'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-fg-secondary">
                <div className="flex items-center gap-1">
                  {getRoleIcon(user.roleRef?.name)}
                  <span className="truncate">{user.roleRef?.name || 'No role'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wallet className="h-3 w-3" />
                  <span>₹{user.ledgerBalance || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{moment(user.createdAt).format('MMM DD, YYYY')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleViewUser(user)}
              className="h-8 w-8 p-0 text-color-info hover:bg-color-info/10"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {user.ledgerBalance && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleViewLedger(user)}
                className="h-8 w-8 p-0 text-color-success hover:bg-color-success/10"
              >
                <CreditCard className="h-4 w-4" />
              </Button>
            )}

            {hasPermission(PERMISSIONS.USER_UPDATE) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditUser(user._id)}
                className="h-8 w-8 p-0 text-color-secondary hover:bg-color-secondary/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {user.isActive && hasPermission(PERMISSIONS.USER_BLOCK) ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleUserStatusToggle(user._id, true)}
                className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
              >
                <CircleOff className="h-4 w-4" />
              </Button>
            ) : (
              hasPermission(PERMISSIONS.USER_UNBLOCK) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUserStatusToggle(user._id, false)}
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

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-color-success/10 text-color-success border-color-success/20'
      : 'bg-color-error/10 text-color-error border-color-error/20';
  };

  const getUserInitials = (name: string) => {
    return (
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    );
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...(data || [])];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((user: IUserTable) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.employeeId?.toLowerCase().includes(searchLower) ||
          user.roleRef?.name?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((user: IUserTable) => {
        if (filterBy === 'active') return user.isActive;
        if (filterBy === 'blocked') return !user.isActive;
        return true;
      });
    }

    // Apply sorting
    return filtered.sort((a: IUserTable, b: IUserTable) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'role':
          return (a.roleRef?.name || '').localeCompare(b.roleRef?.name || '');
        case 'balance':
          return (b.ledgerBalance || 0) - (a.ledgerBalance || 0);
        case 'isActive':
          return Number(b.isActive) - Number(a.isActive);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [data, searchTerm, filterBy, sortBy]);

  const stats = useMemo(() => {
    const total = data?.length || 0;
    const active = data?.filter((user: IUserTable) => user.isActive).length || 0;
    const blocked = total - active;
    const totalBalance = data?.reduce((sum: number, user: IUserTable) => sum + (user.ledgerBalance || 0), 0) || 0;

    return { total, active, blocked, totalBalance };
  }, [data]);

  useEffect(() => {
    const isBlocked = filterBy === 'blocked' ? { isBlocked: true } : filterBy == 'all' ? {} : { isBlocked: false };
    dispatch({ type: FETCH_USERS_DATA, payload: isBlocked });
  }, [dispatch, filterBy]);
  return (
    <>
      <Helmet>
        <title>LOS | Users</title>
      </Helmet>

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-color-primary/5 via-color-secondary/5 to-color-accent/5 rounded-2xl -z-10" />
        <PageHeader
          title="users"
          subtitle="Manage system users, roles, and permissions"
          actions={
            <div className="flex items-center gap-2">
              {(isSuperAdmin(role) || hasPermission(PERMISSIONS.USER_CREATE)) && (
                <Button asChild className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                  <Link to={buildOrgRoute(ROUTES.USER_MANAGEMENT_REGISTER)}>
                    <Plus className="h-4 w-4" />
                    <I8nTextWrapper text="addUser" />
                  </Link>
                </Button>
              )}
            </div>
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Total Users</p>
                <p className="text-2xl font-bold text-color-primary">{stats.total}</p>
              </div>
              <div className="p-3 bg-color-primary/10 rounded-xl">
                <Users2 className="h-6 w-6 text-color-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Active Users</p>
                <p className="text-2xl font-bold text-color-success">{stats.active}</p>
              </div>
              <div className="p-3 bg-color-success/10 rounded-xl">
                <UserCheck className="h-6 w-6 text-color-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Blocked Users</p>
                <p className="text-2xl font-bold text-color-error">{stats.blocked}</p>
              </div>
              <div className="p-3 bg-color-error/10 rounded-xl">
                <CircleOff className="h-6 w-6 text-color-error" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Total Balance</p>
                <p className="text-2xl font-bold text-color-accent">
                  <I8nCurrencyWrapper value={stats.totalBalance} decimal={'1'} separator={','} precision={0} />
                </p>
              </div>
              <div className="p-3 bg-color-accent/10 rounded-xl">
                <Wallet className="h-6 w-6 text-color-accent" />
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
                placeholder="Search users by name, email, or role..."
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
                  <SelectItem value="all">All Users</SelectItem>
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
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="balance">Balance</SelectItem>
                  <SelectItem value="date">Join Date</SelectItem>
                  <SelectItem value="isActive">Active</SelectItem>
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

      {/* User List */}
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
          {filteredAndSortedData.map((user: IUserTable) =>
            viewMode === 'grid' ? renderUserCard(user) : renderUserListItem(user)
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedData.length === 0 && (
        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Users2 className="h-16 w-16 text-fg-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-color-primary mb-2">
              {searchTerm || filterBy !== 'all' ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-fg-secondary mb-4">
              {searchTerm || filterBy !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first user to the system'}
            </p>
            {(isSuperAdmin(role) || hasPermission(PERMISSIONS.USER_CREATE)) && (
              <Button asChild className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                <Link to={buildOrgRoute(ROUTES.USER_MANAGEMENT_REGISTER)}>
                  <Plus className="h-4 w-4" />
                  Add User
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl bg-color-surface border-fg-border">
          <DialogHeader>
            <DialogTitle className="text-color-primary">User Details</DialogTitle>
            <DialogDescription className="text-fg-secondary">
              Complete information about the selected user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-bold text-lg">
                    {getUserInitials(selectedUser.name || selectedUser.employeeId)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-color-primary">
                      {selectedUser.name || selectedUser.employeeId}
                    </h3>
                    <p className="text-fg-secondary">{selectedUser.roleRef?.name || 'No role assigned'}</p>
                    <Badge variant="outline" className={cn('mt-1', getStatusColor(selectedUser.isActive))}>
                      {selectedUser.isActive ? 'Active' : 'Blocked'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* User Information */}
                <div>
                  <h4 className="font-semibold text-color-primary mb-3">User Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-fg-secondary">Email</Label>
                      <p className="text-fg-primary">{selectedUser.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">employeeId</Label>
                      <p className="text-fg-primary">{selectedUser.employeeId}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Role</Label>
                      <p className="text-fg-primary">{selectedUser.roleRef?.name || 'No role assigned'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-fg-secondary">Join Date</Label>
                      <p className="text-fg-primary">{moment(selectedUser.createdAt).format('DD/MM/YYYY')}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h4 className="font-semibold text-color-primary mb-3">Financial Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-fg-secondary">Ledger Balance</Label>
                      <p className="text-fg-primary font-semibold">₹{selectedUser.ledgerBalance || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Branch Information */}
                <div>
                  <h4 className="font-semibold text-color-primary mb-3">Branch Access</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedUser.branches) ? (
                      selectedUser.branches.map((branch, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {branch}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {selectedUser.branches || 'No branches assigned'}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Permissions */}
                {selectedUser.roleRef?.permissions && (
                  <div>
                    <h4 className="font-semibold text-color-primary mb-3">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.roleRef.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Ledger Balance Dialog */}
      <Dialog open={isLedgerOpen} onOpenChange={setIsLedgerOpen}>
        <DialogContent className="max-w-4xl bg-color-surface border-fg-border">
          <DialogHeader>
            <DialogTitle className="text-color-primary">Transaction History</DialogTitle>
            <DialogDescription className="text-fg-secondary">
              {selectedUser?.name || selectedUser?.employeeId} - Ledger Balance: ₹{selectedUser?.ledgerBalance || 0}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="max-h-[60vh] overflow-auto">
              <LedgerBalance ledgerBalanceHistory={selectedUser.ledgerBalanceHistory} userId={selectedUser._id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
