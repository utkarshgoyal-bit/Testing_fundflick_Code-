import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import camelToTitle from '@/helpers/camelToTitle';
import {
  getNextMonthlyDate,
  getNextWeekdayFromName,
  getNextYearlyDateFromStrings,
  toFormatDate,
} from '@/helpers/dateFormater';
import { PRIORITY_TYPES } from '@/lib/enums';
import { REPEAT_STATUS } from '@/lib/enums/task';
import { FETCH_USERS_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Plus } from 'lucide-react';
import moment from 'moment-timezone';
import { MultiSelect } from '@/components/multi-select';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FormSchema, ITaskFormType } from './formSchema';
import I8nTextWrapper from '@/translations/i8nTextWrapper';

const TaskTypes = ['payment', 'pendency', 'approvals', 'other'];

const PaymentTypes = ['first', 'part', 'final'];
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

export function NewTask({
  timezone,
  formatDate,
  onAddTaskHandler,
  isCAType,
  task,
}: {
  timezone: string;
  formatDate: string;
  isCAType: boolean;
  onAddTaskHandler: (payload: ITaskFormType & { _id?: string }) => void;
  task?: any;
}) {
  const { data: clientsData } = useSelector((state: RootState) => state.client);
  const [clients, setClient] = useState<any[]>(clientsData);
  const form = useForm<ITaskFormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: task
      ? {
          title: task.title || '',
          caseNo: task.caseNo || '',
          description: task.description || '',
          users: task.users || [],
          type: task.type || 'pendency',
          repeat: task.repeat || REPEAT_STATUS.NO_REPEAT,
          weeklyDay: task.weeklyDay || '',
          monthlyDay: task.monthlyDay || '',
          yearlyMonth: task.yearlyMonth || '',
          yearlyDay: task.yearlyDay || '',
          startDate: task.startDate || moment().tz(timezone).startOf('day').valueOf(),
          dueAfterDays: task.dueAfterDays || 0,
          priorityOfTask: task.priorityOfTask || 1,
          cc: task.cc || [],
          approvalBased: task.approvalBased || false,
          paymentType: task.paymentType || '',
          amount: task.amount || '',
        }
      : {
          title: '',
          caseNo: '',
          description: '',
          users: [],
          type: 'pendency',
          repeat: REPEAT_STATUS.NO_REPEAT,
          weeklyDay: '',
          monthlyDay: '',
          yearlyMonth: '',
          yearlyDay: '',
          startDate: moment().tz(timezone).startOf('day').valueOf(),
          dueAfterDays: 0,
        },
  });
  const [formStep, setFormStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { tableConfiguration } = useSelector((state: RootState) => state.userManagement);
  const { data: usersData } = tableConfiguration;
  const [formattedStartDate, setFormattedStartDate] = useState<string>();
  const dispatch = useDispatch();

  const isOther = form.watch('type') == 'other';
  const taskType = form.watch('type');
  const isPayment = form.watch('type') === 'payment';
  const clientId = form.watch('caseNo');
  const clientName = clientsData.find((item) => item._id === clientId)?.name || 'N/A';

  useEffect(() => {
    if (isOpen) {
      form.reset();
      setFormStep(0);
      setClient(clientsData);
    }
  }, [isOpen, task, timezone, form, clientsData]);

  useEffect(() => {
    const payload: any = { isBlocked: false, isFetchClients: isCAType };
    if (['payment', 'approvals'].includes(taskType)) {
      payload.branchName = 'MAITRII_Jaipur_H.O.';
    }
    if (taskType === 'other') {
      payload.isAllowSelfUser = true;
    }
    dispatch({ type: FETCH_USERS_DATA, payload });
  }, [dispatch]);

  const formatStartDateForRepeatTasks = ({
    _repeat,
    _weeklyDay,
    _monthlyDay,
    _yearlyMonth,
    _yearlyDay,
  }: {
    _repeat: string;
    _weeklyDay?: string;
    _monthlyDay?: string;
    _yearlyMonth?: string;
    _yearlyDay?: string;
  }) => {
    if (_repeat === REPEAT_STATUS.WEEKLY && _weeklyDay) {
      return getNextWeekdayFromName(_weeklyDay).unix();
    }
    if (_repeat === REPEAT_STATUS.MONTHLY && _monthlyDay) {
      return getNextMonthlyDate(+_monthlyDay).unix();
    }
    if (_repeat === REPEAT_STATUS.YEARLY && _yearlyMonth && _yearlyDay) {
      return getNextYearlyDateFromStrings(_yearlyMonth, _yearlyDay).unix();
    }
    if (_repeat === REPEAT_STATUS.NO_REPEAT) {
      return form.watch('startDate');
    }
  };

  function onSubmit(data: ITaskFormType) {
    const payload = {
      ...data,
      startDate: formatStartDateForRepeatTasks({
        _monthlyDay: data.monthlyDay,
        _repeat: data.repeat,
        _weeklyDay: data.weeklyDay,
        _yearlyMonth: data.yearlyMonth,
        _yearlyDay: data.yearlyDay,
      }),
    };
    if (task) {
      onAddTaskHandler({ ...payload, _id: task._id });
    } else {
      onAddTaskHandler(payload);
    }
    setIsOpen(false);
  }

  useEffect(() => {
    if (form.watch('type') === 'approvals') {
      form.setValue('dueAfterDays', 3);
    } else {
      form.setValue('dueAfterDays', 1);
    }
  }, [form]);

  useEffect(() => {
    if (form.watch('type') !== 'payment') {
      form.setValue('paymentType', undefined);
      form.setValue('amount', undefined);
    }
  }, [form.watch('type'), form]);

  useEffect(() => {
    if (form.watch('repeat') !== REPEAT_STATUS.NO_REPEAT) {
      const startDateUnix = formatStartDateForRepeatTasks({
        _monthlyDay: form.watch('monthlyDay'),
        _repeat: form.watch('repeat'),
        _weeklyDay: form.watch('weeklyDay'),
        _yearlyMonth: form.watch('yearlyDay'),
        _yearlyDay: form.watch('yearlyDay'),
      });
      if (!startDateUnix) return;
      setFormattedStartDate(
        String(
          toFormatDate({
            date: Number(startDateUnix),
            toFormat: formatDate,
          })
        )
      );
    } else {
      setFormattedStartDate(
        form.watch('startDate')
          ? String(toFormatDate({ date: form.watch('startDate') as number, toFormat: formatDate }))
          : ''
      );
    }
  }, [form.watch(), formatStartDateForRepeatTasks]);
  const onSearchClientHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    if (!searchTerm) {
      setClient(clientsData);
    } else {
      const filteredDepartments = clientsData.filter((client) => client.name.toLowerCase().includes(searchTerm));
      setClient(filteredDepartments);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-color-primary text-fg-on-accent">
          <Plus className="h-4 w-4" />
          <I8nTextWrapper text="newTask" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[1000px] sm:w-[540px] overflow-y-auto max-h-[100vh]">
        <SheetHeader>
          <SheetTitle>Create New Task</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new task and assign it to team members
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {formStep === 0 && (
              <>
                {!isCAType && (
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of task</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type of task" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TaskTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {camelToTitle(type)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isPayment && (
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment type</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex">
                            {PaymentTypes.map((type) => (
                              <FormItem key={type} className="flex items-end gap-2  ">
                                <FormControl>
                                  <RadioGroupItem value={type} />
                                </FormControl>
                                <FormLabel className="font-normal">{camelToTitle(type)}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {isPayment && (
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment amount</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount " type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {(isOther || isCAType) && (
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {!isCAType && (
                  <FormField
                    control={form.control}
                    name="caseNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case No / FI No</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter case number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {!isOther && isCAType && (
                  <FormField
                    control={form.control}
                    name="caseNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value} required>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Client" />
                            </SelectTrigger>
                            <SelectContent>
                              <input
                                type="text"
                                placeholder="Search clients..."
                                className="w-full p-2 border border-gray-300 rounded-md"
                                onChange={onSearchClientHandle}
                              />
                              {clients?.map((client) => (
                                <SelectItem key={client._id} value={client._id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="users"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <MultiSelect
                        options={usersData?.map((item: any) => ({
                          label: `${item.name} (${item?.roleRef?.name ? item?.roleRef?.name : item?.role})`,
                          value: item.employeeId,
                        }))}
                        value={field.value?.map((user: any) => user.employeeId) || []}
                        onValueChange={(selectedIds) => {
                          const selectedUsers =
                            usersData
                              ?.filter((item: any) => selectedIds.includes(item.employeeId))
                              .map((item: any) => ({
                                name: `${item.name} (${item?.roleRef?.name ? item?.roleRef?.name : item?.role})`,
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description / Task Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the task" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {((form.watch('type') !== 'payment' &&
                  form.watch('type') !== 'pendency' &&
                  form.watch('type') !== 'approvals') ||
                  isCAType) && (
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
                            {Object.values(REPEAT_STATUS).map((rep) => (
                              <FormItem key={rep} className="flex items-end space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={rep} />
                                </FormControl>
                                <FormLabel className="font-normal capitalize">{camelToTitle(rep)}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.watch('repeat') === REPEAT_STATUS.NO_REPEAT && (
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
                {form.watch('repeat') === 'weekly' && (
                  <FormField
                    control={form.control}
                    name="weeklyDay"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Which days?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-start">
                            {WeekDays.map((day, index) => (
                              <FormItem key={index} className="flex items-end  gap-2">
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
                {form.watch('repeat') === 'monthly' && (
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
                {form.watch('repeat') === 'yearly' && (
                  <div className="flex gap-4 col-span-2 w-full justify-between">
                    <FormField
                      control={form.control}
                      name="yearlyMonth"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Month</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Months.map((month, i) => (
                                <SelectItem key={i} value={(i + 1).toString()}>
                                  {month}
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

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="dueAfterDays"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Due After Day(s)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={10} value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            {formStep === 1 && (
              <div className="space-y-2">
                <Card className="p-4 my-3">
                  <CardHeader className="text-lg font-semibold mb-4">Review Task Details</CardHeader>
                  <CardContent>
                    <table className="min-w-full table-auto border border-gray-300">
                      <tbody>
                        <tr>
                          <td className="font-semibold border px-4 py-2">Type:</td>
                          <td className="border px-4 py-2">{camelToTitle(form.getValues('type'))}</td>
                        </tr>

                        {form.getValues('type') === 'payment' && (
                          <>
                            <tr>
                              <td className="font-semibold border px-4 py-2">Payment Type:</td>
                              <td className="border px-4 py-2">{camelToTitle(form.getValues('paymentType') || '')}</td>
                            </tr>
                            {form.getValues('amount') && (
                              <tr>
                                <td className="font-semibold border px-4 py-2">Amount:</td>
                                <td className="border px-4 py-2">{form.getValues('amount')}</td>
                              </tr>
                            )}
                          </>
                        )}

                        {isOther && form.getValues('title') && (
                          <tr>
                            <td className="font-semibold border px-4 py-2">Title:</td>
                            <td className="border px-4 py-2">{form.getValues('title')}</td>
                          </tr>
                        )}

                        {!isCAType && (
                          <tr>
                            <td className="font-semibold border px-4 py-2">Case No / FI No:</td>
                            <td className="border px-4 py-2">{form.getValues('caseNo') || 'N/A'}</td>
                          </tr>
                        )}
                        {isCAType && (
                          <tr>
                            <td className="font-semibold border px-4 py-2">Client Name:</td>
                            <td className="border px-4 py-2">{clientName || 'N/A'}</td>
                          </tr>
                        )}

                        <tr>
                          <td className="font-semibold border px-4 py-2">Assigned To:</td>
                          <td className="border px-4 py-2">
                            {form
                              .getValues('users')
                              .map((user) => user.name)
                              .join(', ')}
                          </td>
                        </tr>

                        {form.getValues('description') && (
                          <tr>
                            <td className="font-semibold border px-4 py-2">Description:</td>
                            <td className="border px-4 py-2">{form.getValues('description')}</td>
                          </tr>
                        )}

                        <tr>
                          <td className="font-semibold border px-4 py-2">Repeat:</td>
                          <td className="border px-4 py-2">{camelToTitle(form.getValues('repeat'))}</td>
                        </tr>

                        <tr>
                          <td className="font-semibold border px-4 py-2">Start Date:</td>
                          <td className="border px-4 py-2">{formattedStartDate}</td>
                        </tr>
                        {form.getValues('repeat') === REPEAT_STATUS.NO_REPEAT && (
                          <tr>
                            <td className="font-semibold border px-4 py-2">Due Date:</td>
                            <td className="border px-4 py-2">
                              {moment(form.getValues('startDate'))
                                .tz(timezone)
                                .add(form.getValues('dueAfterDays'), 'days')
                                .format(formatDate)}
                            </td>
                          </tr>
                        )}

                        {form.getValues('repeat') === REPEAT_STATUS.WEEKLY && form.getValues('weeklyDay') && (
                          <tr>
                            <td className="font-semibold border px-4 py-2">Weekly Days:</td>
                            <td className="border px-4 py-2">{form.getValues('weeklyDay')}</td>
                          </tr>
                        )}

                        {form.getValues('repeat') === REPEAT_STATUS.MONTHLY && form.getValues('monthlyDay') && (
                          <tr>
                            <td className="font-semibold border px-4 py-2">Monthly Day:</td>
                            <td className="border px-4 py-2">{form.getValues('monthlyDay')}</td>
                          </tr>
                        )}

                        {form.getValues('repeat') === REPEAT_STATUS.YEARLY && form.getValues('yearlyMonth') && (
                          <tr>
                            <td className="font-semibold border px-4 py-2">Yearly Month:</td>
                            <td className="border px-4 py-2">
                              {Months[parseInt(form.getValues('yearlyMonth') as string) - 1]}
                            </td>
                          </tr>
                        )}

                        {form.getValues('repeat') === REPEAT_STATUS.YEARLY && form.getValues('yearlyDay') && (
                          <tr>
                            <td className="font-semibold border px-4 py-2">Yearly Day:</td>
                            <td className="border px-4 py-2">{form.getValues('yearlyDay')}</td>
                          </tr>
                        )}

                        <tr>
                          <td className="font-semibold border px-4 py-2">Due After Day(s):</td>
                          <td className="border px-4 py-2">{form.getValues('dueAfterDays')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                <FormField
                  control={form.control}
                  name="priorityOfTask"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority of task</FormLabel>
                      <Select onValueChange={field.onChange} value={field?.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a priority of task" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRIORITY_TYPES.map((type) => (
                            <SelectItem key={type.key} value={type.key.toString()}>
                              {camelToTitle(type.value)}
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
                  name="cc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CC</FormLabel>
                      <MultiSelect
                        options={tableConfiguration.data?.map((item: any) => ({
                          label: `${item.name} (${item?.roleRef?.name ? item?.roleRef?.name : item?.role})`,
                          value: item.employeeId,
                        }))}
                        value={field.value?.map((user: any) => user.employeeId) || []}
                        onValueChange={(selectedIds) => {
                          const selectedUsers =
                            tableConfiguration.data
                              ?.filter((item: any) => selectedIds.includes(item.employeeId))
                              .map((item: any) => ({
                                name: `${item.name} (${item?.roleRef?.name ? item?.roleRef?.name : item?.role})`,
                                employeeId: item.employeeId,
                              })) || [];
                          field.onChange(selectedUsers);
                        }}
                        placeholder="Select CC users"
                        className="bg-white rounded-md"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approvalBased"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormLabel className="mt-2">Want your Approval on the task complete</FormLabel>
                      <Checkbox className=" p-0" checked={field.value} onCheckedChange={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {formStep === 0 && (
              <div className="flex gap-4 justify-end w-full">
                <Button
                  type="button"
                  className="mt-4 w-1/4"
                  onClick={() => {
                    setFormStep(1);
                  }}
                >
                  Next
                </Button>
              </div>
            )}
            <div className="flex gap-4 justify-end w-full">
              {formStep === 1 && (
                <>
                  <Button
                    variant={'outline'}
                    type="button"
                    className="mt-4 w-1/4"
                    onClick={() => {
                      setFormStep(0);
                    }}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="mt-4 w-1/4">
                    Submit
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
