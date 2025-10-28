import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import handleLoadLocalFile from '@/helpers/loadCompressFile';
import { RootState } from '@/redux/store';
import { ADD_CUSTOMER_PHOTOS_DATA } from '@/redux/actions/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const FormSchema = z.object({
  photoGroup: z.string().min(1, 'Photo group is required'),
  title: z.string().min(1, 'Title is required'),
  photo: z.any().optional(),
  // description: z.string().min(1, "Description is required").optional(),
});
export type photoFormType = z.infer<typeof FormSchema> & { _id: string };
export default function PhotoForm({
  defaultValue,
}: {
  defaultValue?: {
    photoGroup: string;
  };
}) {
  const { stepsData, loading } = useSelector((state: RootState) => state.customerFiles);
  const photoRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValue,
  });
  const navigation = useNavigate();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: ADD_CUSTOMER_PHOTOS_DATA,
      payload: { ...data, customer_id: stepsData?._id },
      navigation,
    });
  }

  const handleCameraClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:grid md:grid-cols-2 max-md:space-y-2 gap-3 p-5">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="max-md:text-sm">{'Title*'}</FormLabel>
              <FormControl>
                <Input className="max-md:text-sm" type="text" {...field} placeholder="Enter the title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Photo Field */}
        <div className="flex items-end  gap-2">
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'Customer Photo*'}</FormLabel>
                <FormControl>
                  <Input
                    className="max-md:text-sm"
                    type="file"
                    ref={photoRef}
                    capture="environment"
                    accept="image/*,.pdf"
                    onChange={async (event) => {
                      field.onChange(await handleLoadLocalFile(event));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="h-11">
            <Button type="button" onClick={() => handleCameraClick(photoRef)}>
              <Camera />
            </Button>
          </div>
        </div>
        {/* Description Field */}
        {/* <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="max-md:text-sm">
                                {"Description*"}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="max-md:text-sm"
                                    type="text"
                                    {...field}
                                    placeholder="Enter a description"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
        <FormField
          control={form.control}
          name="photoGroup"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="max-md:text-sm">
                                {"Photo Group*"}
                            </FormLabel> */}
              <FormControl>
                <Input className="max-md:text-sm" type="text" hidden {...field} placeholder="Enter the photo group" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button disabled={loading} type="submit" className="col-span-2 mt-3">
          Submit
        </Button>
      </form>
    </Form>
  );
}
