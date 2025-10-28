import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { EXPORT_CASES } from '@/redux/store/actionTypes';

const FormSchema = z.object({
  startDate: z.string().min(2, {
    message: 'Start date must be at least 2 characters.',
  }),
  endDate: z.string().min(2, {
    message: 'End date must be at least 2 characters.',
  }),
});

export default function ExportCases() {
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({ type: EXPORT_CASES, payload: data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input min={form.watch('startDate')} type="date" placeholder="End date" {...field} />
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
