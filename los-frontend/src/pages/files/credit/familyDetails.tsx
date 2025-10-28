import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GET_CREDIT_FAMILY_DETAILS, UPDATE_CREDIT_FAMILY_DETAILS } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from "./progressBar";
import { calculateFamilyProgress } from "@/utils/progress";

const familySchema = z.object({
  isMarried: z.string().min(1, 'Required'),
  fatherLive: z.string().min(1, 'Required'),
  motherLive: z.string().min(1, 'Required'),
  children: z.coerce.number().min(0),
  siblings: z.coerce.number().min(0),
  earningMembers: z.coerce.number().min(0),
  monthlyEarning: z.coerce.number().min(0),
  remarks: z.string().optional(),
});

type FamilyFormValues = z.infer<typeof familySchema>;

export default function FamilyDetails() {
  const dispatch = useDispatch();
  const { familyDetails } = useSelector((state: RootState) => state.credit);
  const form = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues: familyDetails || {
      isMarried: '',
      fatherLive: '',
      motherLive: '',
      children: 0,
      siblings: 0,
      earningMembers: 0,
      monthlyEarning: 0,
      remarks: '',
    },
  });

  const onSubmit = (data: FamilyFormValues) => {
    dispatch({ type: UPDATE_CREDIT_FAMILY_DETAILS, payload: data });
  };
  useEffect(() => {
    dispatch({ type: GET_CREDIT_FAMILY_DETAILS });
  }, []);

  useEffect(() => {
    form.reset(familyDetails);
  }, [familyDetails, form]);
  const watchedValues = form.watch();
const progress = calculateFamilyProgress(watchedValues);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-6 mx-auto mt-4 border rounded-lg shadow bg-white"
      >
         <div className="mb-4">
          <ProgressBar
            label="Family Details Progress"
            percentage={progress}
          />
        </div>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">FAMILY DETAILS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="isMarried"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are You Married</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fatherLive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father Is Live Or Not</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motherLive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother Is Live Or Not</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="children"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How Many Children</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siblings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How Many Siblings/Brothers</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="earningMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Earning Members</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyEarning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Monthly Earning</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter any remarks" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6 col-span-2 w-full">
          <Button type="submit" className="col-span-2 w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
