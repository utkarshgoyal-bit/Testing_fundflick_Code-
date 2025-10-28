import TableSkeleton from '@/components/shared/tableSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { FETCH_QUESTIONS_DATA, TELEPHONE_QUESTION_VERIFICATION } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { calculateTeleVerificationProgress } from '@/utils/progress';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CheckCircleIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import ProgressBar from './progressbar';
const FormSchema = z.object({
  review: z.enum(['positive', 'negative']),
  description: z.string().optional(),
});
export default function TelVerification() {
  const dispatch = useDispatch();
  const { selectedFile } = useSelector((state: RootState) => state.customerFiles);
  const { tableConfiguration, loading } = useSelector((state: RootState) => state.questionsSlice);
  const { data } = tableConfiguration;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      review: selectedFile?.teleVerificationReport?.review || 'positive',
      description: selectedFile?.teleVerificationReport?.description || '',
    },
  });
  useEffect(() => {
    dispatch({ type: FETCH_QUESTIONS_DATA });
  }, []);
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    dispatch({
      type: TELEPHONE_QUESTION_VERIFICATION,
      payload: { ...data, fileId: selectedFile.loanApplicationNumber },
    });
    form.reset({
      description: '',
      review: 'positive',
    });
  };

  const progress = calculateTeleVerificationProgress({
    teleVerificationReport: {
      review: form.watch('review'),
      description: form.watch('description'),
    },
  });

  return (
    <div className="space-y-4 w-full">
      <ProgressBar label="Tel Verification" percentage={progress} />
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="my-3">
          {data.map((item: any, index: number) => (
            <div key={item._id} className="flex items-start gap-4 border-b border-gray-100 py-4 last:border-none">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-primary-600 font-semibold flex items-center justify-center text-sm shadow-sm">
                  Q{index + 1}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="text-sm font-medium text-gray-800 leading-tight">{item.question}</h2>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">Tele Verification Report Form</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Review About Customer</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex  items-center  gap-3 "
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="positive" />
                      </FormControl>
                      <FormLabel className="font-normal">Positive</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="negative" />
                      </FormControl>
                      <FormLabel className="font-normal">Negative</FormLabel>
                    </FormItem>
                  </RadioGroup>
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
                  <Textarea placeholder="Write description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedFile?.teleVerificationReports?.length &&
            selectedFile.teleVerificationReports.map((item: any, key: number) => (
              <Card
                key={key}
                className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-indigo-50 via-white to-white rounded-t-xl p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    Tele-Verification Report
                  </h2>
                </div>

                <CardContent className="p-5 space-y-4 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                      {item.verifiedBy.firstName[0]}
                      {item.verifiedBy.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.verifiedBy.firstName} {item.verifiedBy.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Verified by</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                    <span>{item.verifiedBy.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>{new Date(item.verifiedAt)?.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          <div className="w-full flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Save the tele verification report'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
