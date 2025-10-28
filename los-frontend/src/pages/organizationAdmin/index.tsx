import PageHeader from '@/components/shared/pageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import getStatusColor from '@/helpers/getStatusColor';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { DELETE_ORGANIZATION, FETCH_ORGANIZATION_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import {
  Building2,
  Edit3,
  FileText,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Eye,
  Grid3X3,
  List,
  Shield,
  Ban,
  RefreshCw,
} from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function OrganizationAdmin() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { tableConfiguration, loading } = useSelector((state: RootState) => state.organizations);
  const { data: organizationsData, active, total, page } = tableConfiguration;
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getOrganizationInitials = (name: string) => {
    return (
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'ORG'
    );
  };

  const filteredOrganizations =
    organizationsData?.filter(
      (org) =>
        org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    dispatch({ type: FETCH_ORGANIZATION_DATA });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleEdit = (id: string) => {
    navigation({
      pathname: buildOrgRoute(`${ROUTES.ORGANIZATION_ADMIN}${ROUTES.CREATE}`),
      search: `?edit=true&id=${id}`,
    });
  };

  const handleDelete = (id: string) => {
    dispatch({
      type: DELETE_ORGANIZATION,
      payload: { _id: id },
    });
  };

  useEffect(() => {
    dispatch({ type: FETCH_ORGANIZATION_DATA });
  }, [page, dispatch]);

  return (
    <Fragment>
      <Helmet>
        <title>LOS | Organization</title>
      </Helmet>
      {/* Page Header */}
      <PageHeader
        title="Organization Admin"
        subtitle="Manage organization."
        actions={
          hasPermission(PERMISSIONS.ORGANIZATIONS_ADMIN) && (
            <Link to={buildOrgRoute(`${ROUTES.ORGANIZATION_ADMIN}${ROUTES.CREATE}`)}>
              <Button className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </Link>
          )
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Total Organizations</p>
                <p className="text-2xl font-bold text-color-primary">{total}</p>
              </div>
              <div className="p-3 bg-color-primary/10 rounded-xl">
                <Building2 className="h-6 w-6 text-color-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Active</p>
                <p className="text-2xl font-bold text-color-success">{active || 0}</p>
              </div>
              <div className="p-3 bg-color-success/10 rounded-xl">
                <Shield className="h-6 w-6 text-color-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Pending</p>
                <p className="text-2xl font-bold text-color-warning">
                  {organizationsData?.filter((org) => org.status === 'PENDING').length || 0}
                </p>
              </div>
              <div className="p-3 bg-color-warning/10 rounded-xl">
                <Phone className="h-6 w-6 text-color-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fg-secondary">Total Modules</p>
                <p className="text-2xl font-bold text-color-accent">
                  {organizationsData?.reduce((acc, org) => acc + (org.modules?.length || 0), 0) || 0}
                </p>
              </div>
              <div className="p-3 bg-color-accent/10 rounded-xl">
                <MessageCircle className="h-6 w-6 text-color-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Controls */}
      <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-tertiary" />
              <Input
                placeholder="Search organizations by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-color-surface border-fg-border"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 border border-fg-border rounded-lg p-1 bg-color-surface">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
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

              <span className="text-sm text-fg-tertiary">
                {filteredOrganizations.length} of {total} organizations
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Content */}
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
          {filteredOrganizations.map((item, index) =>
            viewMode === 'grid' ? (
              // Grid Card View
              <Card
                key={item._id}
                className="group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-color-surface/80 backdrop-blur-sm"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-color-primary/3 via-transparent to-color-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="relative pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-semibold">
                          {getOrganizationInitials(item.name)}
                        </div>
                        <div
                          className={cn(
                            'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                            item.status === 'ACTIVE'
                              ? 'bg-color-success'
                              : item.status === 'PENDING'
                                ? 'bg-color-warning'
                                : 'bg-color-error'
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-color-primary truncate">
                          {item.name || 'Unnamed Organization'}
                        </CardTitle>
                        <CardDescription className="text-sm text-fg-secondary truncate">
                          Organization #{index + 1}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={cn('text-xs', getStatusColor(item.status))}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  {/* Organization Information */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-color-info" />
                      <span className="text-fg-secondary truncate">{item.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageCircle className="h-4 w-4 text-color-success" />
                      <span className="text-fg-secondary">Modules: {item.modules?.length || 0}</span>
                    </div>
                  </div>

                  <Separator className="bg-fg-border/30" />

                  {/* Modules */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-color-accent" />
                      <span className="text-sm font-medium text-fg-tertiary">Assigned Modules</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.modules?.slice(0, 2).map((module: string) => (
                        <Badge key={module} variant="secondary" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                      {item.modules?.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.modules.length - 2} more
                        </Badge>
                      )}
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

                      {hasPermission(PERMISSIONS.ORGANIZATIONS_ADMIN) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(item._id)}
                                className="h-8 w-8 p-0 text-color-secondary hover:bg-color-secondary/10"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Organization</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasPermission(PERMISSIONS.ORGANIZATIONS_ADMIN) && item.isActive && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(item._id)}
                                className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Organization</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // List View
              <Card
                key={item._id}
                className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-color-surface/80 backdrop-blur-sm"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-semibold text-sm">
                          {getOrganizationInitials(item.name)}
                        </div>
                        <div
                          className={cn(
                            'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
                            item.status === 'ACTIVE'
                              ? 'bg-color-success'
                              : item.status === 'PENDING'
                                ? 'bg-color-warning'
                                : 'bg-color-error'
                          )}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-color-primary truncate">
                            {item.name || 'Unnamed Organization'}
                          </span>
                          <Badge variant="outline" className={cn('text-xs', getStatusColor(item.status))}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-fg-secondary">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{item.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>Modules: {item.modules?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span>Org #{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-color-info hover:bg-color-info/10">
                        <Eye className="h-4 w-4" />
                      </Button>

                      {hasPermission(PERMISSIONS.ORGANIZATIONS_ADMIN) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item._id)}
                          className="h-8 w-8 p-0 text-color-secondary hover:bg-color-secondary/10"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      )}

                      {hasPermission(PERMISSIONS.ORGANIZATIONS_ADMIN) && item.isActive && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item._id)}
                          className="h-8 w-8 p-0 text-color-error hover:bg-color-error/10"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}

      {!filteredOrganizations.length && (
        <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Building2 className="h-16 w-16 text-fg-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-color-primary mb-2">
              {searchTerm ? 'No organizations found' : 'No organizations yet'}
            </h3>
            <p className="text-fg-secondary mb-4">
              {searchTerm
                ? 'Try adjusting your search criteria or create a new organization'
                : 'Start by adding your first organization to the system'}
            </p>
            {hasPermission(PERMISSIONS.ORGANIZATIONS_ADMIN) && (
              <Button asChild className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                <Link to={buildOrgRoute(`${ROUTES.ORGANIZATION_ADMIN}${ROUTES.CREATE}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Organization
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Fragment>
  );
}
