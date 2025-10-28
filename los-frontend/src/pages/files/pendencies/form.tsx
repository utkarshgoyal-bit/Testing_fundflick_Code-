import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import apiCaller from '@/helpers/apiHelper';
import { ADD_PENDENCY } from '@/redux/actions/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

const FormSchema = z.object({
  employeeId: z.string().min(2, {
    message: 'User name must be at least 2 characters.',
  }),
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  pendencyType: z.enum(['general', 'serious', 'conditional'])
  
});

type IFileHandlers = {
  roleRef: {
    _id: string;
    name: string;
  };
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}[];
export function AddPendency({ loanApplicationNumber }: { loanApplicationNumber: string }) {
  const dispatch = useDispatch();
  const [fileHandlers, setFileHandlers] = useState<IFileHandlers>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      pendencyType: 'general',

    },
  });
  async function getFileHandlers() {
    const response = await apiCaller<IFileHandlers>(
      `/customer-file/file-operations/file-handlers?fileId=${loanApplicationNumber}`,
      'GET'
    );
    if (!(response instanceof AxiosError) && response.data) {
      setFileHandlers(response.data.filter((handler) => handler.employeeId));
    }
  }
  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: ADD_PENDENCY,
      payload: { ...data, fileId: loanApplicationNumber },
    });
  }
  useEffect(() => {
    getFileHandlers();
  }, []);
  useEffect(() => {
    form.setValue('employeeId', fileHandlers?.[0]?.employeeId._id || '');
  }, [fileHandlers, form]);
  console.log(fileHandlers);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
  control={form.control}
  name="pendencyType"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Pendency Type <span className="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select Pendency Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general" className="flex flex-col">
              <span>General : </span>
              <span className="text-xs text-gray-500">Does not stop at any step.</span>
            </SelectItem>
            <SelectItem value="serious" className="flex flex-col">
              <span>Serious : </span>
              <span className="text-xs text-gray-500">
                Stops the process at the point of origin.
              </span>
            </SelectItem>
            <SelectItem value="conditional" className="flex flex-col">
              <span>Conditional : </span>
              <span className="text-xs text-gray-500">
                Prevents proceeding with the payment step.
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Assign to <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileHandlers &&
                      fileHandlers.map((handler) => (
                        <SelectItem key={handler.employeeId?._id} value={handler.employeeId?._id}>
                          {handler.employeeId?.firstName || ''} {handler.employeeId?.lastName || ''} (
                          {handler?.roleRef?.name || 'NA'})
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Write pendency summary" className="h-10 text-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Write pendency description" className="h-10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size={'sm'} className="w-full">
          Add Pendency
        </Button>
      </form>
    </Form>
  );
}
