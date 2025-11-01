import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import camelToTitle from '@/helpers/camelToTitle';
import { PRIORITY_TYPES } from '@/lib/enums';
import moment from 'moment-timezone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MONTHS } from '@/constants/constants';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';

type MyFormProps = {
  form: any;
  repeatType: string;
  formatDate?: string;
  usersData: any[];
  timezone: string;
  isNoRepeat: boolean;
  isWeekly: boolean;
  isMonthly: boolean;
  isYearly: boolean;
  setFormStep: (step: number) => void;
  departments: any[];
  services: any[];
};

const ReviewBulkTask = ({
  form,
  repeatType,
  formatDate,
  usersData,
  timezone,
  isNoRepeat,
  isWeekly,
  isMonthly,
  isYearly,
  setFormStep,
  departments,
  services,
}: MyFormProps) => {
  const formattedStartDate = form.getValues('startDate')
    ? moment(form.getValues('startDate')).tz(timezone).format(formatDate)
    : 'N/A';

  const selectedDepartmentId = form.getValues('departmentId');
  const selectedServiceId = form.getValues('serviceId');

  const departmentName =
    departments.find((dep: { _id: string }) => dep._id === selectedDepartmentId)?.departmentName || 'N/A';
  const serviceName =
    services.find((ser: { serviceId: string }) => ser.serviceId === selectedServiceId)?.serviceName || 'N/A';

  return (
    <div className="space-y-2">
      <Card className="my-3 space-y-2">
        <CardContent>
          <table className="min-w-full table-auto border border-gray-300">
            <tbody>
              <tr>
                <td className="font-semibold border px-4 py-2">Department:</td>
                <td className="border px-4 py-2">{departmentName}</td>
              </tr>

              <tr>
                <td className="font-semibold border px-4 py-2">Service:</td>
                <td className="border px-4 py-2">{serviceName}</td>
              </tr>

              <tr>
                <td className="font-semibold border px-4 py-2">Assigned To:</td>
                <td className="border px-4 py-2">
                  {form
                    .getValues('users')
                    ?.map((user: { name: string }) => user.name)
                    .join(', ') || 'N/A'}
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
                <td className="border px-4 py-2">{camelToTitle(repeatType)}</td>
              </tr>

              <tr>
                <td className="font-semibold border px-4 py-2">Start Date:</td>
                <td className="border px-4 py-2">{formattedStartDate}</td>
              </tr>

              {isNoRepeat && (
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

              {isWeekly && form.getValues('weeklyDay') && (
                <tr>
                  <td className="font-semibold border px-4 py-2">Weekly Days:</td>
                  <td className="border px-4 py-2">{form.getValues('weeklyDay')}</td>
                </tr>
              )}

              {isMonthly && form.getValues('monthlyDay') && (
                <tr>
                  <td className="font-semibold border px-4 py-2">Monthly Day:</td>
                  <td className="border px-4 py-2">{form.getValues('monthlyDay')}</td>
                </tr>
              )}

              {isYearly && form.getValues('yearlyMonth') && (
                <tr>
                  <td className="font-semibold border px-4 py-2">Yearly Month:</td>
                  <td className="border px-4 py-2">{MONTHS[parseInt(form.getValues('yearlyMonth') as string) - 1]}</td>
                </tr>
              )}

              {isYearly && form.getValues('yearlyDay') && (
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
            <FormLabel className="mt-2">Want your Approval on the task complete?</FormLabel>
            <Checkbox className="p-0" checked={field.value} onCheckedChange={field.onChange} />
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-4 justify-end w-full">
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
      </div>
    </div>
  );
};

export default ReviewBulkTask;
