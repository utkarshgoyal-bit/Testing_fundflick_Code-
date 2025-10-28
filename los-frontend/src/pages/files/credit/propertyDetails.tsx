import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GET_CREDIT_PROPERTY_DETAILS, UPDATE_CREDIT_PROPERTY_DETAILS } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculatePropertyDetailsProgress } from "@/utils/progress";
import  ProgressBar  from "./progressBar";

const formSchema = z.object({
  assetsSeen: z.string().min(1, 'Required'),
  estimatedCost: z.coerce.number().min(1, 'Required'),
  marketability: z.string().min(1, 'Required'),
  deviationSeen: z.string().min(1, 'Required'),
  eMeterInstalled: z.string().min(1, 'Required'),
  commonEntrance: z.string().min(1, 'Required'),
  mismatchBoundaries: z.string().min(1, 'Required'),
  neighborName: z.string(),
  livingStandard: z.string().optional(),
  coordinates: z.string(),
  remarks: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PropertyDetails() {
  const dispatch = useDispatch();
  const { propertyDetails } = useSelector((state: RootState) => state.credit);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: propertyDetails || {
      assetsSeen: '',
      estimatedCost: '',
      mismatchBoundaries: '',
      marketability: '',
      deviationSeen: '',
      eMeterInstalled: '',
      commonEntrance: '',
      neighborName: '',
      coordinates: '',
      // livingStandard: '',
      remarks:''
    },
  });
   const mergedValues = { ...propertyDetails, ...form.getValues() };
 const progress = calculatePropertyDetailsProgress(mergedValues);
  const onSubmit = (data: FormValues) => {
      console.log("Submitting data:", data);
    dispatch({ type: UPDATE_CREDIT_PROPERTY_DETAILS, payload: data });
  };
  useEffect(() => {
    dispatch({ type: GET_CREDIT_PROPERTY_DETAILS });
  }, []);

  useEffect(() => {
    form.reset(propertyDetails);
  }, [propertyDetails, form]);
  return (
    <Form {...form}>
      <ProgressBar label='' percentage={progress}/>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" mx-auto p-6 space-y-6 border rounded grid max-md:flex max-md:flex-col grid-cols-2 max-md:grid-cols-1 gap-6"
      >
        <FormField
          control={form.control}
          name="assetsSeen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Assets Seen During The Visit
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Flat, Land, Shop" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Estimated Cost Of Assets Seen During The Visit
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. 500000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'marketability'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Marketability Of Assets To Be Mortgage
                <span className="text-red-600">*</span>
              </FormLabel>
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
          name={'deviationSeen'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Any Other Deviation Seen During The Assets Visit
                <span className="text-red-600">*</span>
              </FormLabel>
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
          name={'eMeterInstalled'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Is E-Meter Installed On Assets <span className="text-red-600">*</span>
              </FormLabel>
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
          name={'commonEntrance'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Direct Accessiblity From Road<span className="text-red-600">*</span>
              </FormLabel>
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
          name="mismatchBoundaries"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Any Mismatch In Four Boundaries
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter a value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="neighborName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name Of Neighbor Reference</FormLabel>
              <FormControl>
                <Input placeholder="Enter a value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="livingStandard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Living Standard</FormLabel>
              <FormControl>
                <Input placeholder="Enter a value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coordinates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Coordinates Of Assets</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 26.8467° N, 80.9462° E" {...field} />
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
                <Textarea placeholder="Enter additional notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full col-span-2">
          Submit
        </Button>
      </form>
    </Form>
  );
}
