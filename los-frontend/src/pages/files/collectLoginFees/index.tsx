import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SUBMIT_CUSTOMER__PAYMENT } from '@/redux/actions/types';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

const FormSchema = z.object({
  amount: z.number().nonnegative({ message: 'amount must be a positive number' }).min(2, {
    message: 'amount must be at least 2 characters.',
  }),
  paymentMethod: z.enum(['CASH', 'UPI', 'NET BANKING', 'CHEQUE']),
  remarks: z.string().optional(),
  paymentDate: z.string({ required_error: 'Payment Date is required' }),
});
export default function CollectLoginFees({ loanApplicationNumber }: { loanApplicationNumber: string }) {
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: 'CASH',
      remarks: '',
      paymentDate: moment().format('YYYY-MM-DD'),
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: SUBMIT_CUSTOMER__PAYMENT,
      payload: { ...data, loanApplicationNumber },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter Amount"
                  {...field}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      field.onChange(null);
                    } else {
                      field.onChange(Number(e.target.value));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CASH" />
                    </FormControl>
                    <FormLabel className="font-normal">Cash</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="UPI" />
                    </FormControl>
                    <FormLabel className="font-normal">UPI</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="NET BANKING" />
                    </FormControl>
                    <FormLabel className="font-normal">Net Banking</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CHEQUE" />
                    </FormControl>
                    <FormLabel className="font-normal">Cheque</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <textarea
                  className="max-md:text-sm block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm leading-6 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Write Remarks"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Date</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Remarks"
                  type="date"
                  min={moment().subtract(7, 'days').format('YYYY-MM-DD')}
                  max={moment().format('YYYY-MM-DD')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
