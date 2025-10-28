import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CREATE_CASE_REMARK } from '@/redux/store/actionTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const FormSchema = z.object({
  remark: z.string().min(2, {
    message: 'Remark must be at least 2 characters.',
  }),
});

export default function CaseRemarkForm() {
  const dispatch = useDispatch();
  const params = useParams();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      remark: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({ type: CREATE_CASE_REMARK, payload: { ...data, caseNo: params.caseNo } });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Add your remarks" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2 items-center justify-end p-2">
          <Button
            type="submit"
            className="h-10 px-6 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors "
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
