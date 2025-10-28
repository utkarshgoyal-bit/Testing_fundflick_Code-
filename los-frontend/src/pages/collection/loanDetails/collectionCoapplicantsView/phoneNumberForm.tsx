import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { UPDATE_CASE_CONTACT_NO } from '@/redux/store/actionTypes';

const FormSchema = z.object({
  contactNo: z.string().min(2, {
    message: 'employeeId must be at least 2 characters.',
  }),
});

export default function PhoneNumberForm({
  defaultValues,
  coApplicantName,
  isCoApplicant,
  caseNo,
}: {
  defaultValues?: string;
  isCoApplicant?: boolean;
  coApplicantName?: string;
  caseNo: string;
}) {
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contactNo: [defaultValues]?.join(',') || '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: UPDATE_CASE_CONTACT_NO,
      payload: {
        contactNo: data.contactNo.split(',').map((item) => item.trim()),
        coApplicantName: coApplicantName,
        isCoApplicant: isCoApplicant,
        caseNo,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="contactNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact numbers</FormLabel>
              <FormControl>
                <Input placeholder="contact numbers" {...field} />
              </FormControl>
              <FormDescription>Write comma separated contact numbers ex: 1234567890, 1234567890</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end w-full">
          <Button
            type="submit"
            className="h-10 px-6 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
