import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IBranchTable, IEmployeeTable, IRolesTable } from '@/lib/interfaces/tables';
import {
  EDIT_USERS_DATA,
  FETCH_BRANCHES_DATA,
  FETCH_EMPLOYEES_DATA,
  FETCH_ROLE_DATA,
  FETCH_USERS_DATA_BY_ID,
  REGISTER_USERS_DATA,
} from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Building,
  CheckCircle,
  Crown,
  Edit2Icon,
  HelpCircle,
  Shield,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageHeader from '@/components/shared/pageHeader';
import BranchTreeMultiSelect from './branchesSelection';

const FormSchema = z.object({
  employeeId: z.string({
    required_error: 'Please select a user name.',
  }),
  roleRef: z.string({
    required_error: 'Please select a role.',
  }),
});

type FormData = z.infer<typeof FormSchema>;

export function UserForm() {
  const { tableConfiguration, loading: branchLoading } = useSelector((state: RootState) => state.branch);
  const { data: rolesData, loading: rolesLoading } = useSelector((state: RootState) => state.roles);
  const { tableConfiguration: EmployeeTable, loading: employeeLoading } = useSelector(
    (state: RootState) => state.employee
  );
  const { selectedUser, loading: userLoading } = useSelector((state: RootState) => state.userManagement);
  const { data: branchesData } = tableConfiguration;
  const { data: employeeData } = EmployeeTable;
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const queryParams = new URLSearchParams(window.location.search);
  const isEditForm: boolean = queryParams.get('edit') !== null;
  const id = queryParams.get('id');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      employeeId: '',
      roleRef: '',
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = branchLoading || rolesLoading || employeeLoading || userLoading;
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (isEditForm) {
        dispatch({
          type: EDIT_USERS_DATA,
          payload: { ...data, id, branches: selectedBranches },
          navigation: navigate,
        });
      } else {
        dispatch({
          type: REGISTER_USERS_DATA,
          payload: { ...data, branches: selectedBranches },
          navigation: navigate,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset({
      employeeId: '',
      roleRef: '',
    });
    setSelectedBranches([]);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const getSelectedEmployee = () => {
    const selectedEmployeeId = form.watch('employeeId');
    return employeeData?.find((emp: IEmployeeTable) => emp._id === selectedEmployeeId);
  };

  const getSelectedRole = () => {
    const selectedRoleId = form.watch('roleRef');
    const selectedRole = rolesData?.find((role: IRolesTable) => role._id === selectedRoleId);
    return selectedRole;
  };

  const getRoleIcon = (roleName: string) => {
    const role = roleName?.toLowerCase() || '';
    if (role.includes('admin')) return <Crown className="h-4 w-4 text-color-error" />;
    if (role.includes('manager')) return <Shield className="h-4 w-4 text-color-primary" />;
    if (role.includes('head')) return <UserCheck className="h-4 w-4 text-color-info" />;
    return <User className="h-4 w-4 text-color-secondary" />;
  };
  useEffect(() => {
    if (isEditForm) {
      dispatch({ type: FETCH_USERS_DATA_BY_ID, payload: { id } });
    }
    dispatch({ type: FETCH_BRANCHES_DATA, filter: { isRoot: true } });
    dispatch({ type: FETCH_EMPLOYEES_DATA });
    dispatch({ type: FETCH_ROLE_DATA });
  }, [dispatch, id, isEditForm]);

  useEffect(() => {
    if (selectedUser && isEditForm) {
      const formData = {
        employeeId: selectedUser.employeeId,
        roleRef: selectedUser.roleRef?._id || '',
        branches: selectedUser.branches || [],
      };
      form.reset(formData);
      setSelectedBranches(selectedUser?.branches);
    }
  }, [selectedUser, employeeData, branchesData, isEditForm, form]);

  useEffect(() => {
    if (!isEditForm) {
      form.reset({
        employeeId: '',
        roleRef: '',
      });
      setSelectedBranches([]);
    }
  }, [isEditForm, form]);
  return (
    <>
      <Helmet>
        <title>LOS | {isEditForm ? 'Edit User' : 'Create User'}</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-color-background via-color-surface to-color-surface-muted p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-color-primary/5 via-color-secondary/5 to-color-accent/5 rounded-2xl -z-10" />
            <PageHeader
              title={isEditForm ? 'editUser' : 'registerUser'}
              subtitle={
                isEditForm
                  ? 'Update user information and permissions'
                  : 'Create a new user account with role and branch access'
              }
            />
          </div>

          {/* Form */}
          <Card className="border-0 shadow-lg bg-color-surface/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-color-surface-muted rounded w-1/4 animate-pulse" />
                      <div className="h-12 bg-color-surface-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Employee Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-color-primary" />
                        <h3 className="text-lg font-semibold text-color-primary">Employee Information</h3>
                      </div>

                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium text-color-primary flex items-center gap-2">
                              Select Employee
                              <span className="text-color-error">*</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-fg-tertiary cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Choose an employee to create a user account for</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={isEditForm}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-color-surface border-fg-border focus:border-color-primary">
                                  <SelectValue placeholder="Select an employee..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-color-surface border-fg-border">
                                {employeeData?.map((employee: IEmployeeTable) => (
                                  <SelectItem key={employee._id} value={employee._id}>
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white text-sm font-semibold">
                                        {employee.firstName?.charAt(0)}
                                        {employee.lastName?.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="font-medium">
                                          {employee.firstName} {employee.lastName}
                                        </p>
                                        <p className="text-xs text-fg-secondary">
                                          {employee.designation} - {employee.email}
                                        </p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {form.formState.errors.employeeId && (
                              <div className="flex items-center gap-1 text-sm text-color-error">
                                <AlertCircle className="h-4 w-4" />
                                <FormMessage />
                              </div>
                            )}

                            {/* Selected Employee Preview */}
                            {getSelectedEmployee() && (
                              <div className="mt-3 p-4 bg-color-primary/5 rounded-lg border border-color-primary/20">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-color-primary to-color-secondary flex items-center justify-center text-white font-semibold">
                                    {getSelectedEmployee()?.firstName?.charAt(0)}
                                    {getSelectedEmployee()?.lastName?.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-color-primary">
                                      {getSelectedEmployee()?.firstName} {getSelectedEmployee()?.lastName}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-fg-secondary">
                                      <div>Email: {getSelectedEmployee()?.email}</div>
                                      <div>Designation: {getSelectedEmployee()?.designation}</div>
                                      <div>Mobile: {getSelectedEmployee()?.mobile}</div>
                                      <div>Employee ID: {getSelectedEmployee()?.eId}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="bg-fg-border/30" />

                    {/* Role Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-color-primary" />
                        <h3 className="text-lg font-semibold text-color-primary">Role & Permissions</h3>
                      </div>

                      <FormField
                        control={form.control}
                        name="roleRef"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium text-color-primary flex items-center gap-2">
                              User Role
                              <span className="text-color-error">*</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-fg-tertiary cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Assign a role to define user permissions and access levels</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-color-surface border-fg-border focus:border-color-primary">
                                  <SelectValue placeholder="Select a role..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-color-surface border-fg-border">
                                {rolesData?.map((role: IRolesTable) => (
                                  <SelectItem key={role._id} value={role._id}>
                                    <div className="flex items-center gap-3">
                                      {getRoleIcon(role.name)}
                                      <div>
                                        <p className="font-medium">{role.name}</p>
                                        <p className="text-xs text-fg-secondary">
                                          {role.permissions?.length || 0} permissions
                                        </p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {form.formState.errors.roleRef && (
                              <div className="flex items-center gap-1 text-sm text-color-error">
                                <AlertCircle className="h-4 w-4" />
                                <FormMessage />
                              </div>
                            )}

                            {/* Selected Role Preview */}
                            {getSelectedRole() && (
                              <div className="mt-3 p-4 bg-color-secondary/5 rounded-lg border border-color-secondary/20">
                                <div className="flex items-center gap-3 mb-3">
                                  {getRoleIcon(getSelectedRole()?.name || '')}
                                  <div>
                                    <h4 className="font-semibold text-color-primary">{getSelectedRole()?.name}</h4>
                                    <p className="text-sm text-fg-secondary">
                                      {getSelectedRole()?.permissions?.length || 0} permissions assigned
                                    </p>
                                  </div>
                                </div>
                                {(getSelectedRole()?.permissions?.length || 0) > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {getSelectedRole()
                                      ?.permissions.slice(0, 5)
                                      .map((permission: string, index: number) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {permission.replace(/_/g, ' ')}
                                        </Badge>
                                      ))}
                                    {(getSelectedRole()?.permissions?.length || 0) > 5 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{(getSelectedRole()?.permissions?.length || 0) - 5} more
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="bg-fg-border/30" />

                    {/* Branch Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-color-primary" />
                        <h3 className="text-lg font-semibold text-color-primary">Branch Access</h3>
                      </div>
                      <FormLabel className="text-sm font-medium text-color-primary flex items-center gap-2">
                        Accessible Branches
                        <span className="text-color-error">*</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-fg-tertiary cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select branches this user can access and manage</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>

                      <div className="space-y-3">
                        <BranchTreeMultiSelect
                          data={branchesData || []}
                          selectedBranches={selectedBranches}
                          setSelectedBranches={setSelectedBranches}
                        />

                        {/* Selected Branches Preview */}
                        {selectedBranches.length > 0 && (
                          <div className="p-4 bg-color-accent/5 rounded-lg border border-color-accent/20">
                            <h5 className="font-medium text-color-primary mb-2">
                              Selected Branches ({selectedBranches.length})
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {selectedBranches.map((branchData, index: number) => {
                                const branch = branchesData?.find((b: IBranchTable) => b.name === branchData);
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-color-surface rounded border border-fg-border"
                                  >
                                    <Building className="h-4 w-4 text-color-accent" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm text-fg-primary truncate">{branchData}</p>
                                      {branch && (
                                        <p className="text-xs text-fg-secondary truncate">
                                          {branch.city}, {branch.state}
                                        </p>
                                      )}
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newValues = selectedBranches.filter((b) => b !== branchData);
                                        setSelectedBranches(newValues);
                                      }}
                                      className="h-6 w-6 p-0 text-fg-tertiary hover:text-color-error"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-fg-border/30" />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none h-12 border-fg-border hover:bg-color-surface-muted"
                      >
                        Reset Form
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none h-12 border-fg-border hover:bg-color-surface-muted"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-12 bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{isEditForm ? 'Updating...' : 'Creating...'}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {isEditForm ? <Edit2Icon className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            <I8nTextWrapper text={isEditForm ? 'updateUser' : 'createUser'} />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
