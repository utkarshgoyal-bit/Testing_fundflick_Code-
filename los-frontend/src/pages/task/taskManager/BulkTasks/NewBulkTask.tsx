import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, CalendarIcon } from 'lucide-react';
import moment from 'moment-timezone';
import { FETCH_DEPARTMENTS, FETCH_USERS_DATA, FETCH_SERVICES, CREATE_BULK_TASK } from '@/redux/actions/types';
import { MONTHS, REPEAT_OPTIONS, WEEK_DAYS } from '@/constants/constants';
import { bulkTaskSchema } from './BulkTaskValidation';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import ReviewBulkTask from './ReviewBulkTask';
import { REPEAT_STATUS } from '@/lib/enums';

export default function NewBulkTask({ timezone = 'Asia/Kolkata' }: { timezone?: string }) {
  const dispatch = useDispatch();
  const { tableConfiguration } = useSelector((state: RootState) => state.userManagement);
  const { data: departments } = useSelector((state: RootState) => state.department);
  const { data: servicesData } = useSelector((state: RootState) => state.service);
  const { data: users } = tableConfiguration || {};
  const [formStep, setFormStep] = useState(0);
  const [services, setServices] = useState<{ serviceName: string; serviceId: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(bulkTaskSchema),
    defaultValues: {
      departmentId: '',
      serviceId: '',
      users: [],
      description: '',
      repeat: REPEAT_STATUS.NO_REPEAT,
      weeklyDay: '',
      monthlyDay: '',
      yearlyMonth: '',
      yearlyDay: '',
      startDate: moment().startOf('day').valueOf(),
      dueAfterDays: 1,
      priorityOfTask: '',
      cc: [],
      approvalBased: false,
    },
  });
  const selectedDept = form.watch('departmentId');
  const repeatType: string = form.watch('repeat') || '';
  const formatDate = 'YYYY-MM-DD';

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: FETCH_USERS_DATA, payload: { isBlocked: false } });
      dispatch({ type: FETCH_DEPARTMENTS });
      dispatch({ type: FETCH_SERVICES });
      form.reset();
      setFormStep(0);
    }
  }, [dispatch, isOpen, form]);

  useEffect(() => {
    const filteredServices = servicesData
      .filter(({ departments }) => departments._id === selectedDept)
      .map((service) => ({
        serviceName: service.serviceName,
        serviceId: service._id,
      }));
    setServices(filteredServices);
  }, [selectedDept]);

  function onSubmit(data: any) {
    dispatch({ type: CREATE_BULK_TASK, payload: data });
    setIsOpen(false);
    setFormStep(0);
    form.reset();
  }
  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    form.reset({});
  };
  const isNoRepeat = repeatType === REPEAT_STATUS.NO_REPEAT;
  const isWeekly = repeatType === REPEAT_STATUS.WEEKLY;
  const isMonthly = repeatType === REPEAT_STATUS.MONTHLY;
  const isYearly = repeatType === REPEAT_STATUS.YEARLY;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger>
        <Button variant="outline" className="bg-color-primary text-fg-on-accent">
          <Plus className="h-4 w-4" />
          <I8nTextWrapper text="addBulkTask" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[1000px] sm:w-[540px] overflow-y-auto max-h-[100vh]">
        <SheetHeader>
          <SheetTitle className="cursor-pointer">Add Bulk Task</SheetTitle>
          <SheetDescription>Add a new bulk task to the system.</SheetDescription>
        </SheetHeader>
        <div className="mt-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log('Form validation errors:', errors);
              })}
              className="space-y-6"
            >
              {formStep === 0 && (
                <>
                  {/* Department */}
                  <FormField
                    control={form.control}
                    name="departmentId"
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
                            {departments.map((dept) => (
                              <SelectItem key={dept._id} value={dept._id}>
                                {dept.departmentName}
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
                    name="serviceId"
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
                            {services.map((serv) => (
                              <SelectItem key={serv.serviceId} value={serv.serviceId}>
                                {serv.serviceName}
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
                        <MultiSelect
                          options={users?.map((item: any) => ({
                            label: `${item.name}`,
                            value: item.employeeId,
                          }))}
                          value={field.value?.map((user: any) => user.employeeId) || []}
                          onValueChange={(selectedIds) => {
                            const selectedUsers =
                              users
                                ?.filter((item: any) => selectedIds.includes(item.employeeId))
                                .map((item: any) => ({
                                  name: `${item.name}`,
                                  employeeId: item.employeeId,
                                })) || [];
                            field.onChange(selectedUsers);
                          }}
                          placeholder="Select users"
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
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            {REPEAT_OPTIONS.map((rep) => (
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
                  {isWeekly && (
                    <FormField
                      control={form.control}
                      name="weeklyDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Week Day</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-wrap gap-3"
                            >
                              {WEEK_DAYS.map((day) => (
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
                  {isMonthly && (
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
                  {isYearly && (
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
                                {MONTHS.map((m, i) => (
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
                  {isNoRepeat && (
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'}>
                                  {field.value ? (
                                    moment.tz(field.value, timezone).format(formatDate)
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) =>
                                  field.onChange(date ? moment.tz(date, timezone).startOf('day').valueOf() : undefined)
                                }
                                disabled={(date) => {
                                  const today = moment.tz(timezone).startOf('day').toDate();
                                  return date < today || date < new Date('1900-01-01');
                                }}
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Select the start date for this task.</FormDescription>
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
                <ReviewBulkTask
                  form={form}
                  repeatType={repeatType}
                  formatDate={formatDate}
                  setFormStep={setFormStep}
                  usersData={users}
                  timezone={timezone}
                  isNoRepeat={isNoRepeat}
                  isWeekly={isWeekly}
                  isMonthly={isMonthly}
                  isYearly={isYearly}
                  departments={departments}
                  services={services}
                />
              )}
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
