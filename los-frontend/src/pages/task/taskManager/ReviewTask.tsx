import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import camelToTitle from '@/helpers/camelToTitle';
import { PRIORITY_TYPES, REPEAT_STATUS } from '@/lib/enums';
import moment from 'moment-timezone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MONTHS } from '@/constants/constants';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
const ReviewTask = ({
  form,
  formattedStartDate,
  isOther,
  isCAType,
  clientName,
  usersData,
  timezone,
  formatDate,
  setFormStep,
}: {
  form: any;
  formattedStartDate: string;
  isOther: boolean;
  isCAType: boolean;
  clientName: string;
  usersData: any[];
  timezone: string;
  formatDate: string;
  setFormStep: (step: number) => void;
}) => {
  return (
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
                    .map((user: { name: string }) => user.name)
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
                  <td className="border px-4 py-2">{MONTHS[parseInt(form.getValues('yearlyMonth') as string) - 1]}</td>
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
            <FormLabel className="mt-2">Want your Approval on the task complete</FormLabel>
            <Checkbox className=" p-0" checked={field.value} onCheckedChange={field.onChange} />
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

export default ReviewTask;
