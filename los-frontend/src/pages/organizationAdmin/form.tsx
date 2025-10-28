import PageHeader from '@/components/shared/pageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { APP_MODULES_LIST, ORGANIZATION_STATUS } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { CREATE_NEW_ORGANIZATION, EDIT_ORGANIZATION, FETCH_ORGANIZATION_BY_ID } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Check,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  Shield,
  User,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const FormSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  status: z.string().min(1, 'Please select a status'),
  modules: z.array(z.string()).min(1, 'Please select at least one module'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  addressLine1: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  mobile: z.string().optional(),
});

export function OrganizationForm() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const isEditForm = queryParams.get('edit');
  const organizationId = queryParams.get('id');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { SelectedOrganization, loading } = useSelector((state: RootState) => state.organizations);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      status: '',
      modules: [],
      email: '',
      firstName: '',
      lastName: '',
      addressLine1: '',
      country: '',
      state: '',
      mobile: '',
    },
  });

  useEffect(() => {
    if (isEditForm && organizationId) {
      dispatch({
        type: FETCH_ORGANIZATION_BY_ID,
        payload: { _id: organizationId },
      });
    }
  }, [isEditForm, organizationId, dispatch]);

  useEffect(() => {
    if (isEditForm && SelectedOrganization) {
      form.reset(SelectedOrganization);
    }
  }, [SelectedOrganization, form, isEditForm]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);

    if (isEditForm) {
      dispatch({
        type: EDIT_ORGANIZATION,
        payload: { ...data, _id: organizationId },
        navigation,
      });
    } else {
      dispatch({
        type: CREATE_NEW_ORGANIZATION,
        payload: { ...data },
        navigation,
      });
    }

    // Reset submitting state after a delay (will be reset when navigation occurs)
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const selectedModulesCount = form.watch('modules')?.length || 0;
  const watchedStatus = form.watch('status');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-color-success/10 text-color-success border-color-success/20';
      case 'BLOCKED':
        return 'bg-color-error/10 text-color-error border-color-error/20';
      case 'PENDING':
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      default:
        return 'bg-color-surface-muted text-fg-tertiary border-fg-border';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-color-background via-color-surface to-color-surface-muted">
      <Helmet>
        <title>LOS | {isEditForm ? 'Edit Organization' : 'Create Organization'}</title>
      </Helmet>

      <div className="absolute inset-0 bg-gradient-to-br from-color-primary/5 via-transparent to-color-secondary/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-color-primary/5 via-color-secondary/5 to-color-accent/5 rounded-2xl -z-10" />
      <PageHeader
        title={isEditForm ? 'Edit Organization' : 'Create New Organization'}
        subtitle={
          isEditForm
            ? 'Update organization details and permissions'
            : 'Set up a new organization with modules and admin details'
        }
      />

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-color-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-color-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-color-primary">Organization Details</CardTitle>
                    <CardDescription>Basic information about the organization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Organization Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-fg-primary font-medium">
                          <Building2 className="h-4 w-4 text-color-primary" />
                          Organization Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter organization name"
                            className="bg-color-surface border-fg-border focus:border-color-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-color-error" />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-fg-primary font-medium">
                          <Shield className="h-4 w-4 text-color-primary" />
                          Status *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-color-surface border-fg-border focus:border-color-primary">
                              <SelectValue placeholder="Select organization status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-color-surface border-fg-border">
                            {ORGANIZATION_STATUS.map((item) => (
                              <SelectItem key={item.value} value={item.value} className="hover:bg-color-surface-muted">
                                <div className="flex items-center gap-2">
                                  <span>{item.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {watchedStatus && (
                          <div className="mt-2">
                            <Badge variant="outline" className={cn('text-xs', getStatusColor(watchedStatus))}>
                              {watchedStatus}
                            </Badge>
                          </div>
                        )}
                        <FormMessage className="text-color-error" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-color-accent/10 rounded-lg">
                      <Settings className="h-5 w-5 text-color-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-color-primary">Modules & Permissions</CardTitle>
                      <CardDescription>Select which modules this organization can access</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-color-accent/10 text-color-accent border-color-accent/20">
                    {selectedModulesCount} selected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="modules"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {APP_MODULES_LIST.map((item) => {
                          const isChecked = field.value?.includes(item.value);
                          return (
                            <FormControl key={item.value}>
                              <div
                                className={cn(
                                  'flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200',
                                  isChecked
                                    ? 'bg-color-primary/5 border-color-primary/30 shadow-sm'
                                    : 'bg-color-surface-muted/30 border-fg-border hover:border-color-primary/20 hover:bg-color-surface-muted/50'
                                )}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, item.value]
                                      : field.value.filter((v) => v !== item.value);
                                    field.onChange(newValue);
                                  }}
                                  className={cn('border-2', isChecked ? 'border-color-primary' : 'border-fg-border')}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-color-primary" />
                                    <span
                                      className={cn(
                                        'font-medium',
                                        isChecked ? 'text-color-primary' : 'text-fg-primary'
                                      )}
                                    >
                                      {item.label}
                                    </span>
                                  </div>
                                </div>
                                {isChecked && <Check className="h-4 w-4 text-color-primary" />}
                              </div>
                            </FormControl>
                          );
                        })}
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {!isEditForm && (
              <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-color-secondary/10 rounded-lg">
                      <User className="h-5 w-5 text-color-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-color-primary">Super Admin Details</CardTitle>
                      <CardDescription>Information for the organization's primary administrator</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-4 w-4 text-color-primary" />
                      <h4 className="font-medium text-fg-primary">Personal Information</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-fg-primary">First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter first name"
                                className="bg-color-surface border-fg-border focus:border-color-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-color-error" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-fg-primary">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter last name"
                                className="bg-color-surface border-fg-border focus:border-color-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-color-error" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-fg-primary">
                              <Mail className="h-4 w-4 text-color-info" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="admin@organization.com"
                                className="bg-color-surface border-fg-border focus:border-color-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-color-error" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator className="bg-fg-border/30" />

                  {/* Contact Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="h-4 w-4 text-color-primary" />
                      <h4 className="font-medium text-fg-primary">Contact Information</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-fg-primary">Mobile Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter mobile number"
                                className="bg-color-surface border-fg-border focus:border-color-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-color-error" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-fg-primary">
                              <MapPin className="h-4 w-4 text-color-warning" />
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter address"
                                className="bg-color-surface border-fg-border focus:border-color-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-color-error" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator className="bg-fg-border/30" />

                  {/* Location Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="h-4 w-4 text-color-primary" />
                      <h4 className="font-medium text-fg-primary">Location</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-fg-primary">Country</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter country"
                                className="bg-color-surface border-fg-border focus:border-color-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-color-error" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-fg-primary">State/Province</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter state or province"
                                className="bg-color-surface border-fg-border focus:border-color-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-color-error" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Card className="border-0 shadow-md bg-color-surface/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-fg-secondary">
                    {isEditForm
                      ? 'Update the organization details to save changes.'
                      : 'Create the organization with the specified modules and admin details.'}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent min-w-[120px] gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {isEditForm ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {isEditForm ? 'Update Organization' : 'Create Organization'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
