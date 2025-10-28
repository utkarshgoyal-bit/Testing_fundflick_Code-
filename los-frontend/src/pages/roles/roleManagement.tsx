/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { moduleWisePermissionsGroup, permissions } from '@/helpers/permissions'; // <-- uses your updated object
import { cn } from '@/lib/utils';
import { IRolesTable } from '@/lib/interfaces/tables';
import { DELETE_ROLE_DATA, EDIT_ROLE_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import I8nTextWrapper from '@/translations/i8nTextWrapper';

import {
  Pencil,
  Save,
  Shield,
  ShieldCheck,
  Trash,
  Users,
  Lock,
  Key,
  Settings,
  Search,
  CheckCircle,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
  Zap,
  Crown,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/** ===== Types based on your updated permissions shape ===== */

type PermissionLeaf = { key: string; label: string };
type PermissionNode = PermissionLeaf & { children?: PermissionLeaf[] };

type ModuleValue =
  | PermissionNode[] // e.g., Task, Collection (module directly to items)
  | Record<string, PermissionNode[]>; // e.g., Los/Admin (module -> groups -> items)

type PermissionsShape = Record<string, ModuleValue>;

type PermissionGroup = {
  module: string;
  group: string;
  items: PermissionNode[];
};

const buildPermissionGroups = (perms: PermissionsShape): PermissionGroup[] => {
  const groups: PermissionGroup[] = [];
  Object.entries(perms).forEach(([moduleName, moduleVal]) => {
    if (Array.isArray(moduleVal)) {
      // Module directly maps to permission items (Task, Collection)
      groups.push({
        module: moduleName,
        group: moduleName,
        items: moduleVal as PermissionNode[],
      });
    } else {
      // Module has groups (Los, Admin)
      Object.entries(moduleVal as Record<string, PermissionNode[]>).forEach(([groupName, items]) => {
        groups.push({
          module: moduleName,
          group: groupName,
          items,
        });
      });
    }
  });
  return groups;
};

const flattenKeys = (items: PermissionNode[]): string[] => {
  const keys: string[] = [];
  items.forEach((p) => {
    keys.push(p.key);
    p.children?.forEach((c) => keys.push(c.key));
  });
  return keys;
};

const RoleManagement: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.roles);
  const { modules } = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();

  const [selectedRole, setSelectedRole] = useState<IRolesTable>();
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<Set<string>>(new Set());
  const [selectedRolesAccess, setSelectedRolesAccess] = useState<Set<string>>(new Set());

  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editedRoleName, setEditedRoleName] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const permissionGroups = useMemo(() => buildPermissionGroups(permissions as PermissionsShape), []);
  const groupNameSet = useMemo(() => new Set(permissionGroups.map((g) => g.group)), [permissionGroups]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(groupNameSet);

  const groupsByName = useMemo(() => {
    const m: Record<string, PermissionNode[]> = {};
    permissionGroups.forEach((g) => {
      m[g.group] = g.items;
    });
    return m;
  }, [permissionGroups]);

  useEffect(() => {
    if (data.length > 0) {
      const firstRole = data[0];
      setSelectedRole(firstRole);
      setSelectedRolePermissions(new Set(firstRole.permissions));
      setSelectedRolesAccess(new Set(firstRole.rolesAccess));
      setHasUnsavedChanges(false);
    }
  }, [data]);

  const handleRoleChange = (roleName: string) => {
    if (hasUnsavedChanges) {
      return toast.warning('Please save changes before switching roles');
    }
    const role = data.find((rle: any) => rle.name === roleName);
    if (role) {
      setSelectedRole(role);
      setSelectedRolePermissions(new Set(role.permissions));
      setSelectedRolesAccess(new Set(role.rolesAccess));
      setHasUnsavedChanges(false);
    }
  };

  const toggleParent = (parent: PermissionNode, enable: boolean) => {
    setSelectedRolePermissions((prev) => {
      const next = new Set(prev);
      if (enable) {
        next.add(parent.key);
        parent.children?.forEach((c) => next.add(c.key));
      } else {
        next.delete(parent.key);
        parent.children?.forEach((c) => next.delete(c.key));
      }
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const toggleChild = (parent: PermissionNode, childKey: string, enable: boolean) => {
    setSelectedRolePermissions((prev) => {
      const next = new Set(prev);

      if (enable) next.add(childKey);
      else next.delete(childKey);

      const anyChildEnabled = (parent.children ?? []).some((c) => next.has(c.key));
      if (anyChildEnabled) next.add(parent.key);
      else next.delete(parent.key);

      return next;
    });
    setHasUnsavedChanges(true);
  };

  const toggleAllPermissionsInGroup = (groupName: string, enable: boolean) => {
    const items = groupsByName[groupName] ?? [];
    setSelectedRolePermissions((prev) => {
      const next = new Set(prev);
      items.forEach((p) => {
        if (enable) {
          next.add(p.key);
          p.children?.forEach((c) => next.add(c.key));
        } else {
          next.delete(p.key);
          p.children?.forEach((c) => next.delete(c.key));
        }
      });
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const set = new Set(prev);
      if (set.has(groupName)) set.delete(groupName);
      else set.add(groupName);
      return set;
    });
  };

  const handleSave = () => {
    dispatch({
      type: EDIT_ROLE_DATA,
      payload: {
        id: selectedRole?._id,
        data: {
          name: selectedRole?.name,
          permissions: Array.from(selectedRolePermissions),
          rolesAccess: Array.from(selectedRolesAccess),
        },
      },
    });
    setHasUnsavedChanges(false);
  };

  const handleDiscardChanges = () => {
    if (selectedRole) {
      setSelectedRolePermissions(new Set(selectedRole.permissions));
      setSelectedRolesAccess(new Set(selectedRole.rolesAccess));
      setHasUnsavedChanges(false);
    }
  };

  const filteredGroups: PermissionGroup[] = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const byModuleAccess = (g: PermissionGroup) => {
      const modKey = moduleWisePermissionsGroup[g.group as keyof typeof moduleWisePermissionsGroup];
      if (!modKey) return true;
      return modules.includes(modKey as any);
    };

    const filterItems = (items: PermissionNode[]): PermissionNode[] => {
      let out = items;

      if (term) {
        out = out
          .map((p) => {
            const parentMatch = p.label.toLowerCase().includes(term) || p.key.toLowerCase().includes(term);
            const matchedChildren = (p.children ?? []).filter(
              (c) => c.label.toLowerCase().includes(term) || c.key.toLowerCase().includes(term)
            );
            if (parentMatch) {
              // keep parent and all its children
              return { ...p };
            }
            if (matchedChildren.length > 0) {
              return { ...p, children: matchedChildren };
            }
            return null;
          })
          .filter(Boolean) as PermissionNode[];
      }

      if (showOnlyEnabled) {
        out = out
          .map((p) => {
            const parentOn = selectedRolePermissions.has(p.key);
            const enabledChildren = (p.children ?? []).filter((c) => selectedRolePermissions.has(c.key));
            if (parentOn || enabledChildren.length > 0) {
              return { ...p, children: enabledChildren };
            }
            return null;
          })
          .filter(Boolean) as PermissionNode[];
      }

      return out;
    };

    return permissionGroups
      .filter(byModuleAccess)
      .map((g) => ({
        ...g,
        items: filterItems(g.items),
      }))
      .filter((g) => g.items.length > 0 || (term && g.group.toLowerCase().includes(term)));
  }, [modules, permissionGroups, searchTerm, showOnlyEnabled, selectedRolePermissions]);

  const allValidKeysSet = useMemo(() => {
    const all = permissionGroups.flatMap((g) => flattenKeys(g.items));
    return new Set(all);
  }, [permissionGroups]);

  const getPermissionStats = () => {
    const total = allValidKeysSet.size;
    const enabled = Array.from(selectedRolePermissions).filter((k) => allValidKeysSet.has(k)).length;
    const percentage = total > 0 ? Math.round((enabled / total) * 100) : 0;
    return { total, enabled, percentage };
  };

  const stats = getPermissionStats();

  const getRoleIcon = (roleName: string) => {
    const name = roleName?.toLowerCase() || '';
    if (name.includes('admin')) return <Crown className="h-4 w-4 text-color-error" />;
    if (name.includes('manager')) return <ShieldCheck className="h-4 w-4 text-color-primary" />;
    if (name.includes('head')) return <UserCheck className="h-4 w-4 text-color-info" />;
    if (name.includes('collection')) return <Zap className="h-4 w-4 text-color-success" />;
    return <Shield className="h-4 w-4 text-color-secondary" />;
  };

  const getGroupIcon = (groupName: string) => {
    const name = groupName.toLowerCase();
    if (name.includes('dashboard')) return <Settings className="h-4 w-4 text-color-primary" />;
    if (name.includes('employee') || name.includes('user')) return <Users className="h-4 w-4 text-color-info" />;
    if (name.includes('collection')) return <Zap className="h-4 w-4 text-color-success" />;
    if (name.includes('file') || name.includes('customer')) return <Lock className="h-4 w-4 text-color-warning" />;
    return <Key className="h-4 w-4 text-color-secondary" />;
  };

  return (
    <div>
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-color-primary/5 via-color-secondary/5 to-color-accent/5 rounded-2xl -z-10" />
        <Card className="border-0 shadow-lg bg-color-surface/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-color-primary/10 rounded-xl">
                  <Shield className="h-6 w-6 text-color-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-color-primary">Role Management</CardTitle>
                  <CardDescription className="text-fg-secondary">
                    Manage system roles and permissions for {data.length} roles
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-color-primary/20 text-color-primary">
                  {data.length} Roles
                </Badge>
                <Badge variant="outline" className="border-color-success/20 text-color-success">
                  {allValidKeysSet.size} Permissions
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles Sidebar */}
        <Card className="lg:col-span-1 shadow-lg border-0 bg-color-surface/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-color-primary" />
                <CardTitle className="text-lg text-color-primary">System Roles</CardTitle>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Plus className="h-4 w-4 text-color-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create new role</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {data.map((role: any) => {
                  const isEditing = editingRoleId === role._id;
                  const isSelected = selectedRole?.name === role.name;
                  const permissionCount = role.permissions?.length || 0;

                  return (
                    <div
                      key={role._id}
                      onClick={() => handleRoleChange(role.name)}
                      className={cn(
                        'group relative p-4 rounded-lg border transition-all duration-200 cursor-pointer',
                        'hover:shadow-md hover:border-color-primary/30',
                        isSelected
                          ? 'border-color-primary bg-gradient-to-r from-color-primary/10 via-color-primary/5 to-transparent shadow-sm'
                          : 'border-fg-border bg-color-surface hover:bg-color-surface-muted/50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getRoleIcon(role.name)}
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <Input
                                value={editedRoleName}
                                onChange={(e) => setEditedRoleName(e.target.value)}
                                className="h-8 text-sm bg-color-surface border-fg-border"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <div>
                                <div className="font-semibold text-fg-primary truncate">{role.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {permissionCount} permissions
                                  </Badge>
                                  {role.name === 'Admin' && (
                                    <Badge variant="destructive" className="text-xs">
                                      Super Admin
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isEditing ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch({
                                  type: EDIT_ROLE_DATA,
                                  payload: {
                                    id: role._id,
                                    data: {
                                      name: editedRoleName,
                                      permissions: role.permissions,
                                      rolesAccess: role.rolesAccess,
                                    },
                                  },
                                });
                                setEditingRoleId(null);
                              }}
                            >
                              <Save className="h-4 w-4 text-color-success" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRoleId(role._id);
                                setEditedRoleName(role.name);
                              }}
                            >
                              <Pencil className="h-4 w-4 text-color-secondary" />
                            </Button>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash className="h-4 w-4 text-color-error" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-color-surface border-fg-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-color-primary">
                                  <I8nTextWrapper text="confirmDeletion" />
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-fg-secondary">
                                  <I8nTextWrapper text="areYouSure" />
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-fg-border">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-color-error hover:bg-color-error/90 text-fg-on-accent"
                                  onClick={() =>
                                    dispatch({
                                      type: DELETE_ROLE_DATA,
                                      payload: { id: role._id },
                                    })
                                  }
                                >
                                  <I8nTextWrapper text="delete" />
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* Active indicator */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-color-primary rounded-r-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Permissions Panel */}
        <Card className="lg:col-span-2 shadow-lg border-0 bg-color-surface/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-color-primary/10 rounded-lg">
                  <Key className="h-5 w-5 text-color-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg text-color-primary">Permissions: {selectedRole?.name}</CardTitle>
                  <CardDescription className="text-fg-secondary">
                    {stats.enabled} of {stats.total} permissions enabled ({stats.percentage}%)
                  </CardDescription>
                </div>
              </div>

              {/* Stats and Progress */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-color-surface-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-color-primary to-color-accent transition-all duration-300"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-fg-secondary">{stats.percentage}%</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-tertiary" />
                  <Input
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 bg-color-surface border-fg-border"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="show-only-enabled" checked={showOnlyEnabled} onCheckedChange={setShowOnlyEnabled} />
                  <Label htmlFor="show-only-enabled" className="text-sm text-fg-secondary">
                    Show only enabled
                  </Label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDiscardChanges}
                    className="border-fg-border text-fg-secondary hover:bg-color-surface-muted"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Discard
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {filteredGroups.map(({ group, items, module }) => {
                  if (
                    moduleWisePermissionsGroup[group as keyof typeof moduleWisePermissionsGroup] &&
                    !modules.includes(
                      moduleWisePermissionsGroup[group as keyof typeof moduleWisePermissionsGroup] as unknown as string
                    )
                  ) {
                    return null;
                  }

                  const isExpanded = expandedGroups.has(group);
                  const groupAllKeys = flattenKeys(groupsByName[group] ?? items);
                  const enabledInGroup = groupAllKeys.filter((k) => selectedRolePermissions.has(k)).length;
                  const totalInGroup = groupAllKeys.length;
                  const groupPercentage = totalInGroup > 0 ? Math.round((enabledInGroup / totalInGroup) * 100) : 0;

                  return (
                    <Card key={group} className="border border-fg-border/50 bg-color-surface-muted/30">
                      <CardHeader className="pb-3 relative">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            onClick={() => toggleGroup(group)}
                            className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-color-primary" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-color-primary" />
                            )}
                            {getGroupIcon(group)}
                            <span className="font-semibold text-fg-primary">{group}</span>
                            <Badge variant="secondary" className="ml-2">
                              {enabledInGroup}/{totalInGroup}
                            </Badge>
                          </Button>
                          <p className="font-semibold absolute  top-1 left-1 text-fg-primary text-[8px] bg-primary text-white px-2 py-0.5 rounded-full">
                            {module.toUpperCase()}
                          </p>

                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-color-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-color-success to-color-accent transition-all duration-300"
                                style={{ width: `${groupPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-fg-secondary w-10">{groupPercentage}%</span>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleAllPermissionsInGroup(group, true)}
                                className="h-6 w-6 p-0 text-color-success hover:bg-color-success/10"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleAllPermissionsInGroup(group, false)}
                                className="h-6 w-6 p-0 text-color-error hover:bg-color-error/10"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {items.map((perm) => {
                              const parentEnabled = selectedRolePermissions.has(perm.key);
                              const children = perm.children ?? [];

                              // Parent row (always shown)
                              return (
                                <div key={perm.key} className="space-y-2">
                                  <div
                                    className={cn(
                                      'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                                      'hover:border-color-primary/30 cursor-pointer',
                                      parentEnabled
                                        ? 'border-color-primary/20 bg-color-primary/5'
                                        : 'border-fg-border bg-color-surface'
                                    )}
                                    onClick={() => toggleParent(perm, !parentEnabled)}
                                  >
                                    <Checkbox
                                      checked={parentEnabled}
                                      onCheckedChange={(checked) => toggleParent(perm, checked as boolean)}
                                      className="border-fg-border data-[state=checked]:bg-color-primary data-[state=checked]:border-color-primary"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-medium text-fg-primary">{perm.label}</span>
                                      {parentEnabled && (
                                        <div className="flex items-center gap-1 mt-1">
                                          <Sparkles className="h-3 w-3 text-color-primary" />
                                          <span className="text-xs text-color-primary">Active</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Children (if any) */}
                                  {children.length > 0 && (
                                    <div className="ml-6 space-y-1">
                                      {children.map((child) => {
                                        const childEnabled = selectedRolePermissions.has(child.key);
                                        return (
                                          <div
                                            key={child.key}
                                            className={cn(
                                              'flex items-center gap-3 p-2 rounded border transition-all duration-200',
                                              'hover:border-color-primary/30 cursor-pointer',
                                              childEnabled
                                                ? 'border-color-primary/20 bg-color-primary/5'
                                                : 'border-fg-border bg-color-surface'
                                            )}
                                            onClick={() => toggleChild(perm, child.key, !childEnabled)}
                                          >
                                            <Checkbox
                                              checked={childEnabled}
                                              onCheckedChange={(checked) =>
                                                toggleChild(perm, child.key, checked as boolean)
                                              }
                                              className="border-fg-border data-[state=checked]:bg-color-primary data-[state=checked]:border-color-primary"
                                            />
                                            <span className="text-sm">{child.label}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleManagement;
