import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Multiselect from 'multiselect-react-dropdown';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,  } from '@/components/ui/sheet';
import { Plus } from 'lucide-react';
import moment from 'moment';
import { FETCH_USERS_DATA } from '@/redux/actions/types';
import { z } from 'zod';
const bulkTaskSchema = z
  .object({
    department: z.string().min(1, 'Department is required'),
    service: z.string().min(1, 'Service is required'),
    users: z
      .array(
        z.object({
          name: z.string(),
          userDetails: z.string(),
        })
      )
      .min(1, 'At least one user must be assigned'),
    description: z.string().min(1, 'Description is required'),
    repeat: z.enum(['noRepeat', 'weekly', 'monthly', 'quarterly', 'yearly']),
    weeklyDay: z.string().optional(),
    monthlyDay: z.string().optional(),
    yearlyMonth: z.string().optional(),
    yearlyDay: z.string().optional(),
    startDate: z.string().optional(),
    dueAfterDays: z.number().min(1, 'Due after days must be at least 1'),
  })
  .superRefine((data, ctx) => {
    if (data.repeat === 'weekly' && !data.weeklyDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weekly day is required for weekly repeat',
        path: ['weeklyDay'],
      });
    }
    if (data.repeat === 'monthly' && !data.monthlyDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Monthly day is required for monthly repeat',
        path: ['monthlyDay'],
      });
    }
    if (data.repeat === 'yearly' && (!data.yearlyMonth || !data.yearlyDay)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Yearly month and day are required for yearly repeat',
        path: ['yearlyMonth'],
      });
    }
    if (data.repeat === 'noRepeat' && !data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date is required for no repeat',
        path: ['startDate'],
      });
    }
  });
interface BulkTaskFormProps {
  onSubmitTask?: (data: any) => void;
}
const RepeatOptions = ['noRepeat', 'weekly', 'monthly', 'quarterly', 'yearly'];
const WeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const Months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
// Mock departments + services
const Departments = [
  { name: 'Finance', services: ['Audit', 'Tax', 'Payroll'] },
  { name: 'IT', services: ['Support', 'Deployment', 'Security'] },
  { name: 'HR', services: ['Recruitment', 'Employee Relations', 'Training'] },
];
export default function BulkTaskForm({ onSubmitTask }: BulkTaskFormProps) {
  const dispatch = useDispatch();
  const { tableConfiguration } = useSelector((state: RootState) => state.userManagement);
  const [formStep, setFormStep] = useState(0);
  const [services, setServices] = useState<string[]>([]);
  const form = useForm({
    resolver: zodResolver(bulkTaskSchema),
    defaultValues: {
      department: '',
      service: '',
      users: [],
      description: '',
      repeat: 'noRepeat',
      weeklyDay: '',
      monthlyDay: '',
      yearlyMonth: '',
      yearlyDay: '',
      startDate: moment().format('YYYY-MM-DD'),
      dueAfterDays: 1,
    },
  });
  const selectedDept = form.watch('department');
  const repeatType = form.watch('repeat');
  useEffect(() => {
    dispatch({ type: FETCH_USERS_DATA, payload: { isBlocked: false } });
  }, [dispatch]);
  useEffect(() => {
    const dept = Departments.find((d) => d.name === selectedDept);
    setServices(dept ? dept.services : []);
    form.setValue('service', '');
  }, [selectedDept]);
  function onSubmit(data: any) {
    console.log('Bulk Task Data:', data);
    // Save to localStorage
    const savedTasks = JSON.parse(localStorage.getItem('bulkTasks') || '[]');
    const newTask = {
      ...data,
      _id: Date.now().toString(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      taskId: `BULK-${Date.now()}`,
      type: 'bulk',
      createdBy: {
        _id: 'local-user',
        firstName: 'Local',
        lastName: 'User',
      },
      acceptedBy: null,
      isPinned: false,
      priorityOfTask: 2,
    };
    savedTasks.push(newTask);
    localStorage.setItem('bulkTasks', JSON.stringify(savedTasks));
    form.reset();
    setFormStep(0);
    alert('Bulk task created successfully!');
    if (onSubmitTask) onSubmitTask(data);
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" className="bg-color-primary text-fg-on-accent">
          <Plus className="h-4 w-4" />
          Add Bulk
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[1000px] sm:w-[540px] overflow-y-auto max-h-[100vh]">
        <SheetHeader>
          <SheetTitle>Add Bulk Task</SheetTitle>
          <SheetDescription>Add a new bulk task to the system.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formStep === 0 && (
              <>
                {/* Department */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Departments.map((dept) => (
                            <SelectItem key={dept.name} value={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Service */}
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((svc) => (
                            <SelectItem key={svc} value={svc}>
                              {svc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Assign To */}
                <FormField
                  control={form.control}
                  name="users"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <Multiselect
                        options={tableConfiguration.data?.map((item: any) => ({
                          name: `${item.name} (${item?.roleRef?.name || item?.role})`,
                          userDetails: item.employeeId,
                        }))}
                        displayValue="name"
                        showCheckbox
                        selectedValues={field.value}
                        onSelect={field.onChange}
                        onRemove={field.onChange}
                        className="bg-white rounded-md"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter task description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Repeat Options */}
                <FormField
                  control={form.control}
                  name="repeat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                          {RepeatOptions.map((rep) => (
                            <FormItem key={rep} className="flex items-end gap-2">
                              <FormControl>
                                <RadioGroupItem value={rep} />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">{rep}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Conditional fields based on repeatType */}
                {repeatType === 'weekly' && (
                  <FormField
                    control={form.control}
                    name="weeklyDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Week Day</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-3">
                            {WeekDays.map((day) => (
                              <FormItem key={day} className="flex items-center gap-1">
                                <FormControl>
                                  <RadioGroupItem value={day} />
                                </FormControl>
                                <FormLabel>{day}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {repeatType === 'monthly' && (
                  <FormField
                    control={form.control}
                    name="monthlyDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day of Month</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={31} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {repeatType === 'yearly' && (
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="yearlyMonth"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Month</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Months.map((m, i) => (
                                <SelectItem key={i} value={(i + 1).toString()}>
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearlyDay"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Day</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={31} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {repeatType === 'noRepeat' && (
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} min={moment().format('YYYY-MM-DD')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {/* Due After Days */}
                <FormField
                  control={form.control}
                  name="dueAfterDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due After Days</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={() => setFormStep(1)}>
                  Next
                </Button>
              </>
            )}
            {/* Step 2: Review Card */}
            {formStep === 1 && (
              <div className="p-4 border rounded-md bg-white shadow space-y-2">
                <h3 className="text-lg font-semibold">Review Task</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p>
                    <strong>Department:</strong> {form.getValues('department')}
                  </p>
                  <p>
                    <strong>Service:</strong> {form.getValues('service')}
                  </p>
                  <p>
                    <strong>Assigned To:</strong>{' '}
                    {form
                      .getValues('users')
                      .map((u: any) => u.name)
                      .join(', ')}
                  </p>
                  <p>
                    <strong>Description:</strong> {form.getValues('description')}
                  </p>
                  <p>
                    <strong>Repeat:</strong> {repeatType}
                  </p>
                  {repeatType === 'weekly' && (
                    <p>
                      <strong>Week Day:</strong> {form.getValues('weeklyDay')}
                    </p>
                  )}
                  {repeatType === 'monthly' && (
                    <p>
                      <strong>Monthly Day:</strong> {form.getValues('monthlyDay')}
                    </p>
                  )}
                  {repeatType === 'yearly' && (
                    <p>
                      <strong>Yearly:</strong> {Months[parseInt(form.getValues('yearlyMonth')) - 1]}{' '}
                      {form.getValues('yearlyDay')}
                    </p>
                  )}
                  {repeatType === 'noRepeat' && (
                    <p>
                      <strong>Start Date:</strong> {form.getValues('startDate')}
                    </p>
                  )}
                  <p>
                    <strong>Due After Days:</strong> {form.getValues('dueAfterDays')}
                  </p>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button type="button" onClick={() => setFormStep(0)}>
                    Back
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
