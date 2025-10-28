import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import UploadFileBox from '@/components/ui/upload-file';
import { UPLOAD_COLLECTION } from '@/redux/actions/types';
import { useDispatch } from 'react-redux';

const FormSchema = z.object({
  file: z
    .instanceof(File, {
      message: 'Please upload a file.',
    })
    .refine(
      (file) => {
        return (
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel' ||
          file.type == 'text/csv'
        );
      },
      {
        message: 'Only CSV files are allowed.',
      }
    ),
});

export default function UploadCsvFile() {
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({ type: UPLOAD_COLLECTION, payload: data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        {/* File upload field */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload CSV File</FormLabel>
              <FormControl>
                <UploadFileBox
                  errors={form.formState.errors.file?.message}
                  onFileChange={(file) => field.onChange(file)}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                />
              </FormControl>
              <FormDescription>Please upload a xlsx, .xls, .csv file.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
