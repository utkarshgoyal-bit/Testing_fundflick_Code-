import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { UPDATE_CASE_LOCATION } from '@/redux/actions/types';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocateIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { z } from 'zod';
const FormSchema = z.object({
  latitude: z
    .string()
    .min(1, {
      message: 'Latitude is required',
    })
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && isFinite(num) && num >= -90 && num <= 90;
      },
      {
        message: 'Latitude must be a valid latitude between -90 and 90',
      }
    ),
  longitude: z
    .string()
    .min(1, {
      message: 'Longitude is required',
    })
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && isFinite(num) && num >= -180 && num <= 180;
      },
      {
        message: 'Longitude must be a valid longitude between -180 and 180',
      }
    ),
});

export default function UpdateLocationForm({
  defaultValues,
  caseNo,
  name,
}: {
  defaultValues?: z.infer<typeof FormSchema>;
  caseNo?: string;
  name?: string;
}) {
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues || {
      latitude: '',
      longitude: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: UPDATE_CASE_LOCATION,
      payload: {
        latitude: data.latitude,
        longitude: data.longitude,
        caseNo: caseNo,
        name: name,
      },
    });
  }
  const getLatLong = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude.toString());
          form.setValue('longitude', position.coords.longitude.toString());
        },
        () => {
          toast.error('Unable to get your location');
        }
      );
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 space-y-6">
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <I8nTextWrapper text="latitude" />
              </FormLabel>
              <FormControl>
                <Input placeholder="Latitude" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <I8nTextWrapper text="longitude" />
              </FormLabel>
              <FormControl>
                <Input placeholder="Longitude" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit" variant={'outline'} type="button" onClick={getLatLong}>
          <LocateIcon />
        </Button>
        <Button type="submit" disabled={!hasPermission(PERMISSIONS.COLLECTION_UPDATE_LOCATION)}>
          <I8nTextWrapper text="submit" />
        </Button>
      </form>
    </Form>
  );
}
