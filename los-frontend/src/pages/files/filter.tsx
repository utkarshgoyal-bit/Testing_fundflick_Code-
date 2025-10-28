import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { RootState } from '@/redux/store';
import { FETCH_CUSTOMER_FILES_DATA } from '@/redux/actions/types';
import { setFiltersData } from '@/redux/slices/files';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { FILE_STATUS } from '@/lib/enums';

const FormSchema = z.object({
  status: z
    .string({
      required_error: 'Please select a status to display.',
    })
    .optional(),
  loanApplicationNumber: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export default function Filters({ setFilterOpen }: { setFilterOpen: Dispatch<React.SetStateAction<boolean>> }) {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.customerFiles);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: filters || {
      status: '',
      loanApplicationNumber: '',
      startDate: '',
      endDate: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined)
    );
    dispatch(setFiltersData(filteredData));
    dispatch({ type: FETCH_CUSTOMER_FILES_DATA });
    setFilterOpen(false);
  }

  function handleReset() {
    form.setValue('status', '');
    form.setValue('loanApplicationNumber', '');
    form.setValue('startDate', '');
    form.setValue('endDate', '');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <I8nTextWrapper text="fileStatus" />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={FILE_STATUS.PENDING}>
                    <I8nTextWrapper text="pending" />
                  </SelectItem>
                  <SelectItem value={FILE_STATUS.APPROVED}>
                    <I8nTextWrapper text="approved" />
                  </SelectItem>
                  <SelectItem value={FILE_STATUS.TASK_PENDING}>
                    <I8nTextWrapper text="taskPending" />
                  </SelectItem>
                  <SelectItem value={FILE_STATUS.REJECTED}>
                    <I8nTextWrapper text="rejected" />
                  </SelectItem>
                  <SelectItem value={FILE_STATUS.REVIEW}>
                    <I8nTextWrapper text="review" />
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="loanApplicationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <I8nTextWrapper text="loanApplicationNumber" />
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Loan Application Number" {...field} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <I8nTextWrapper text="startDate" />
              </FormLabel>
              <FormControl>
                <Input type="date" placeholder="Enter Start Date" {...field} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <I8nTextWrapper text="endDate" />
              </FormLabel>
              <FormControl>
                <Input type="date" placeholder="Enter End Date" {...field} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="button" className="mr-3" onClick={handleReset}>
          <I8nTextWrapper text="reset" />
        </Button>
        <Button type="submit">
          <I8nTextWrapper text="submit" />
        </Button>
      </form>
    </Form>
  );
}
