import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Briefcase, Building, CheckCircle, ChevronDownIcon, Edit2Icon, FileText, User, Wallet } from 'lucide-react';
// import { IBranchTable } from '@/lib/interfaces/tables';
import PageHeader from '@/components/shared/pageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiCaller from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { IFSCCodeResponse } from '@/lib/interfaces';
import {
  EDIT_EMPLOYEES_DATA,
  FETCH_BRANCHES_DATA,
  FETCH_EMPLOYEES_BY_ID_DATA,
  REGISTER_EMPLOYEES_DATA,
} from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import debounce from 'debounce';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import React from 'react';
import moment from 'moment-timezone';

const FormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  designation: z.string().min(1, 'Designation is required'),
  role: z.string().min(1, 'Status is required'),
  sex: z.string().min(1, 'Gender is required'),
  dob: z.date({ required_error: 'Date of birth is required' }),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  qualification: z.string().optional(),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  uid: z.string().optional(),
  pan: z.string().optional(),
  passport: z.string().optional(),
  voterID: z.string().optional(),
  drivingLicense: z.string().optional(),
  joiningDate: z.date({ required_error: 'Joining date is required' }),
  ledger: z.string().optional(),
  ifsc: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
  baseSalary: z.string().optional(),
  hra: z.string().optional(),
  conveyance: z.string().optional(),
  incentive: z.string().optional(),
  commission: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export function EmployeeForm() {
  const { selectedEmployee, loading: employeeLoading } = useSelector((state: RootState) => state.employee);
  const { loading: branchLoading } = useSelector((state: RootState) => state.branch);

  const queryParams = new URLSearchParams(window.location.search);
  const isEditForm: boolean = queryParams.get('edit') !== null;
  const id = queryParams.get('id');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = employeeLoading || branchLoading;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        dob: data.dob.getTime().toString(),
        joiningDate: data.joiningDate.getTime().toString(),
      };

      if (isEditForm) {
        dispatch({
          type: EDIT_EMPLOYEES_DATA,
          payload: { ...payload, eId: id },
          navigation: navigate,
        });
      } else {
        dispatch({
          type: REGISTER_EMPLOYEES_DATA,
          payload,
          navigation: navigate,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const debouncedHandleIFSCCodeChange = useCallback(
    debounce(async (value: string) => {
      if (!value || value.length !== 11) return;
      const response = await apiCaller<IFSCCodeResponse>('/ifsc/' + value, 'GET', {}, true, {
        error: ERROR_MESSAGE.UNEXPECTED,
        success: 'Bank Details Loaded',
        pending: 'Fetching Bank Details...',
      });
      if (!(response instanceof AxiosError) && response.data) {
        form.setValue(`bankName`, response.data.BANK);
      }
    }, 800),
    []
  );
  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (isEditForm && id) {
      dispatch({ type: FETCH_EMPLOYEES_BY_ID_DATA, payload: { id } });
    }
    dispatch({ type: FETCH_BRANCHES_DATA });
  }, [dispatch, id, isEditForm]);

  useEffect(() => {
    if (selectedEmployee && isEditForm) {
      const formData = {
        ...selectedEmployee,
        dob: selectedEmployee.dob ? new Date(selectedEmployee.dob) : new Date(),
        joiningDate: selectedEmployee.joiningDate ? new Date(selectedEmployee.joiningDate) : new Date(),
      };
      form.reset(formData);
    }
  }, [selectedEmployee, isEditForm, form]);

  const renderFormField = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    type: 'text' | 'email' | 'phone' = 'text',
    customOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              value={(field.value as string) || ''}
              onChange={customOnChange || field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderSelectField = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    options: { value: string; label: string }[]
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={(field.value as string) || ''}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const TIMEZONE = 'Asia/Kolkata';

  const renderDateField = (name: keyof FormData, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const [open, setOpen] = React.useState(false);
        const displayValue = field.value ? moment(field.value).tz(TIMEZONE).format('DD-MM-YYYY') : 'Pick a date';

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className="w-full justify-between font-normal text-left">
                    {displayValue}
                    <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value as Date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (!date) return;
                    const tzDate = moment(date).tz(TIMEZONE).startOf('day');
                    field.onChange(tzDate.toDate());
                    setOpen(false);
                  }}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );

  return (
    <>
      <Helmet>
        <title>LOS | {isEditForm ? 'Edit Employee' : 'Create Employee'}</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <PageHeader
          title={isEditForm ? 'editEmployee' : 'registerEmployee'}
          subtitle={isEditForm ? 'Update employee details' : 'Add a new employee to the system'}
        />

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="personal">
                        <User className="w-4 h-4 mr-2" /> Personal
                      </TabsTrigger>
                      <TabsTrigger value="contact">
                        <Building className="w-4 h-4 mr-2" /> Contact
                      </TabsTrigger>
                      <TabsTrigger value="official">
                        <Briefcase className="w-4 h-4 mr-2" /> Official
                      </TabsTrigger>
                      <TabsTrigger value="documents">
                        <FileText className="w-4 h-4 mr-2" /> Documents
                      </TabsTrigger>
                      <TabsTrigger value="salary">
                        <Wallet className="w-4 h-4 mr-2" /> Salary
                      </TabsTrigger>
                      <TabsTrigger value="bankingDetails">
                        <Wallet className="w-4 h-4 mr-2" /> BankingDetails
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFormField('firstName', 'First Name', 'Enter first name')}
                        {renderFormField('lastName', 'Last Name', 'Enter last name')}
                        {renderDateField('dob', 'Date of Birth')}
                        {renderSelectField('sex', 'Gender', 'Select gender', [
                          { value: 'Male', label: 'Male' },
                          { value: 'Female', label: 'Female' },
                          { value: 'Other', label: 'Other' },
                        ])}
                        {renderSelectField('maritalStatus', 'Marital Status', 'Select marital status', [
                          { value: 'Single', label: 'Single' },
                          { value: 'Married', label: 'Married' },
                        ])}
                        {renderFormField('qualification', 'Qualification', 'Enter qualification')}
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFormField('email', 'Email', 'Enter email address', 'email')}
                        {renderFormField('mobile', 'Mobile Number', 'Enter mobile number', 'phone')}
                        {renderFormField('addressLine1', 'Address Line 1', 'Enter address')}
                        {renderFormField('addressLine2', 'Address Line 2', 'Enter address')}
                        {renderFormField('country', 'Country', 'Enter country')}
                        {renderFormField('state', 'State', 'Enter state')}
                      </div>
                    </TabsContent>

                    <TabsContent value="official" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFormField('designation', 'Designation', 'Enter designation')}
                        {renderDateField('joiningDate', 'Joining Date')}
                        {renderSelectField('role', 'Status', 'Select status', [
                          { value: 'Temporary', label: 'Temporary' },
                          { value: 'Seasonal', label: 'Seasonal' },
                          { value: 'Permanent', label: 'Permanent' },
                        ])}
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFormField('uid', 'Aadhar / UID', 'Enter UID')}
                        {renderFormField('pan', 'PAN Card', 'Enter PAN')}
                        {renderFormField('passport', 'Passport', 'Enter Passport No.')}
                        {renderFormField('voterID', 'Voter ID', 'Enter Voter ID')}
                        {renderFormField('drivingLicense', 'Driving License', 'Enter Driving License No.')}
                      </div>
                    </TabsContent>

                    <TabsContent value="salary" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFormField('baseSalary', 'Base Salary', 'Enter base salary')}
                        {renderFormField('hra', 'HRA', 'Enter HRA')}
                        {renderFormField('conveyance', 'Conveyance', 'Enter conveyance allowance')}
                        {renderFormField('incentive', 'Incentive', 'Enter incentive')}
                        {renderFormField('commission', 'Commission', 'Enter commission')}
                        {renderFormField('ledger', 'Ledger Balance', 'Enter ledger balance')}
                      </div>
                    </TabsContent>

                    <TabsContent value="bankingDetails" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFormField('accountNumber', 'Account Number', 'Enter account number')}

                        {renderFormField('accountName', 'Account Name', 'Enter account holder name')}

                        {renderFormField(
                          'ifsc',
                          'IFSC',
                          'Enter IFSC',
                          'text',
                          (e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value.toUpperCase();
                            form.setValue('ifsc', value);
                            debouncedHandleIFSCCodeChange(value);
                          }
                        )}

                        {renderFormField('bankName', 'Bank Name', 'Auto-filled from IFSC')}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Separator />

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          <span>{isEditForm ? 'Updating...' : 'Creating...'}</span>
                        </>
                      ) : (
                        <>
                          {isEditForm ? <Edit2Icon className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          <I8nTextWrapper text={isEditForm ? 'updateEmployee' : 'createEmployee'} />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
