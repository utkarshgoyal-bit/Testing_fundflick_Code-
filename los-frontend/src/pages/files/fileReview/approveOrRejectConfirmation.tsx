import { SUBMIT_CUSTOMER__STATUS } from '@/redux/actions/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { FILE_STATUS } from '@/lib/enums';

const FormSchema = z.object({
  approveOrRejectRemarks: z.string().optional(),
  confirmationText: z.string({
    required_error: 'Please enter confirmation text',
  }),
});

export default function ApproveOrRejectConfirmation({
  loanApplicationNumber,
  type,
}: {
  loanApplicationNumber: number;
  type: 'approved' | 'rejected';
}) {
  const dispatch = useDispatch();
  const [randomText, setRandomText] = useState('');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      approveOrRejectRemarks: 'N/A',
      confirmationText: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.confirmationText !== randomText) {
      form.setError('confirmationText', {
        message: 'Confirmation text does not match',
      });
      return;
    }
    switch (type) {
      case 'approved':
        dispatch({
          type: SUBMIT_CUSTOMER__STATUS,
          payload: {
            status: FILE_STATUS.APPROVED,
            loanApplicationNumber: loanApplicationNumber,
            data,
          },
        });

        break;
      case 'rejected':
        dispatch({
          type: SUBMIT_CUSTOMER__STATUS,
          payload: {
            status: 'Rejected',
            loanApplicationNumber: loanApplicationNumber,
            data,
          },
        });
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    setRandomText(Math.random().toString(36).substring(7));
  }, []);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        <FormField
          control={form.control}
          name="approveOrRejectRemarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remark</FormLabel>
              <FormControl>
                <textarea
                  className="max-md:text-sm block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm leading-6 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Write Remarks"
                  {...field}
                />
              </FormControl>
              <FormDescription>Write some remarks for this file.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
