import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OCCUPATIONS } from '@/lib/enums';
// import { Separator } from "@/components/ui/separator";
import urlQueryParams from '@/helpers/urlQueryParams';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { ADD_CREDIT_INCOME_DETAILS } from '@/redux/actions/types';

const FormSchema = z.object({
  income: z.number({ required_error: 'Income is required' }).nonnegative('Income must be a positive number'),
  monthlyOtherIncome: z.number().optional(),
  occupation: z.string().min(1, { message: 'Occupation is required' }),
  occupationCategory: z.string().min(1, { message: 'Occupation Category is required' }),
  remarks: z.string().optional(),
});

export default function AddIncome({ customer_id }: { customer_id: string }) {
  const dispatch = useDispatch();
  const isBackOffice = urlQueryParams('component') == 'back_office';

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: ADD_CREDIT_INCOME_DETAILS,
      payload: { ...data, customerDetails: customer_id },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:grid md:grid-cols-2 relative max-md:space-y-3 gap-3 md:p-5 max-md:px-3"
      >
        <h2 className="col-span-2  text-xl font-bold">Add Income</h2>
        {/* <Separator className="col-span-2  bg-secondary" /> */}
        <FormField
          control={form.control}
          name="income"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {'Income'}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isBackOffice}
                  type="number"
                  placeholder="Income"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value.length ? +e.target.value : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyOtherIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'Monthly Other Income'}</FormLabel>
              <FormControl>
                <Input
                  disabled={isBackOffice}
                  type="number"
                  value={field.value}
                  placeholder="Rent/Dairy/Agriculture"
                  onChange={(e) => field.onChange(e.target.value.length ? +e.target.value : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Occupation <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(OCCUPATIONS).map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupationCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Occupation Category <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  disabled={!form.getValues('occupation')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {OCCUPATIONS[form.getValues('occupation') as keyof typeof OCCUPATIONS]?.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <FormLabel>Remarks (if any)</FormLabel>
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

        <div className="flex col-span-2  w-full justify-end items-center gap-5  ">
          <div className="flex justify-end col-span-2 gap-4 my-3">
            <Button type="submit">
              {'Save and next'} <ChevronRight />{' '}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
