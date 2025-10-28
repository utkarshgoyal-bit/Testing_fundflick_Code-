import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { STEPS_NAMES, CITIES } from '@/lib/enums';
import { RootState } from '@/redux/store';
import { ADD_CUSTOMER_ADDRESS_DATA, GET_CUSTOMER_ADDRESS_DATA } from '@/redux/actions/types';
import { setStepsData } from '@/redux/slices/files';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, LocateFixedIcon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Fragment } from 'react/jsx-runtime';
import { z } from 'zod';
import VerifyStepData from './verifyStepData';
import { useEffect } from 'react';

const allCities = Object.entries(CITIES[0]).flatMap(([state, cities]) => {
  if (!cities || !Array.isArray(cities)) return [];

  return cities.map((city) => {
    const label = typeof city === 'string' ? city : city.label;
    const value = typeof city === 'string' ? city : city.value;

    return {
      label,
      value,
      state,
    };
  });
});

const allStates = Object.keys(CITIES[0]).map((state) => ({
  label: state,
  value: state,
}));

const FormSchema = z.object({
  address: z.array(
    z.object({
      pltNo: z.string().min(2),
      addressLine: z.string({ required_error: 'Address is required' }).min(2, {
        message: 'Address is required',
      }),
      addressLineTwo: z.string({ required_error: 'Address is required' }).optional(),

      city: z.string({ required_error: 'City is required' }).min(2, {
        message: 'City is required',
      }),
      state: z.string({ required_error: 'State is required' }).min(2, {
        message: 'State is required',
      }),
      country: z.string({ required_error: 'Country is required' }).min(2, {
        message: 'Country is required',
      }),
      pinCode: z.string({ required_error: 'Pincode is required' }).min(6, {
        message: 'Pincode is required',
      }),
      gpsCoordinates: z.string({ required_error: 'GPS Coordinates is required' }).optional(),
    })
  ),
});

export default function Step2() {
  const dispatch = useDispatch();
  const { addressData: fileAddress, loading } = useSelector((state: RootState) => state.fileAddress);
  const queryParams = new URLSearchParams(window.location.search);
  const fileId = queryParams.get('id');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: fileAddress.address,
    },
  });
  const { errors } = form.formState;
  console.log(errors);
  const addressLineFields = useFieldArray({
    control: form.control,
    name: 'address',
  });

  const handleAddAddressLine = () => {
    addressLineFields.append({
      pltNo: '',
      addressLine: '',
      addressLineTwo: '',
      city: '',
      state: '',
      country: 'India',
      pinCode: '',
      gpsCoordinates: '',
    });
  };

  const handleDeleteAddressLine = (index: number) => {
    addressLineFields.remove(index);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch(setStepsData(data));
    dispatch({
      type: ADD_CUSTOMER_ADDRESS_DATA,
      payload: { ...data, _id: fileId },
    });
  }

  const handleLocateClick = async (index: number) => {
    return new Promise((resolve, reject) => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const address = await getAddressFromCoordinates(latitude, longitude);
              form.setValue(`address.${index}.gpsCoordinates`, `${latitude},${longitude}`);
              if (address) {
                setAddressFields(address, index);
                resolve('Location found');
              } else {
                reject('Location not found please provide location access.');
              }
            },
            () => {
              reject('Error getting location: Please allow location access.');
            }
          );
        } else {
          reject('Geolocation is not supported by this browser.');
        }
      } catch (error) {
        reject('Error fetching address: ' + error);
      }
    });
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      const data = await response.json();
      return {
        addressLine: data.display_name || '',
        city: data.address.city || data.address.town || '',
        state: data.address.state || '',
        country: data.address.country || '',
        pinCode: data.address.postcode || '',
      };
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  const setAddressFields = (address: any, index: number) => {
    Object.entries(address).forEach(([key, value]) => form.setValue(`address.${index}.${key}` as any, value));
  };
  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_ADDRESS_DATA });
  }, []);
  useEffect(() => {
    form.reset({ address: fileAddress.address });
  }, [fileAddress]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:grid md:grid-cols-2 max-md:space-y-3 gap-3 md:p-5 max-md:px-3"
      >
        <h2 className="col-span-2 font-bold text-xl">Customer Address Information</h2>
        {addressLineFields.fields.map((field, index) => (
          <Fragment key={field.id}>
            {index == 0 && <h2 className="col-span-2 font-bold text-lg">Primary</h2>}
            <Separator className="col-span-2 bg-secondary" />
            <FormField
              name={`address.${index}.pltNo`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {'Plot .No / Patta No. / Khasra No.'} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Plot .No / Patta No. / Khasra No." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={`address.${index}.addressLine`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {'Address line ' + (index + 1)} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address line" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`address.${index}.addressLineTwo`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Address Line ' + (index + 2)}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address line" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              name={`address.${index}.city`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"City name"} <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                  <FormControl>
                    <Input placeholder="Enter city name" {...field} />
                  </FormControl>
                  <SelectContent>
                      {CITIES.map((cities) => (
                        <SelectItem key={cities.label} value={cities.value}>
                          {cities.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name={`address.${index}.city`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    City Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(selectedValue) => {
                      field.onChange(selectedValue);
                      const found = allCities.find((c) => c.value === selectedValue);
                      if (found) {
                        form.setValue(`address.${index}.state`, found.state);
                      }
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`address.${index}.state`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    State <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={`address.${index}.country`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Country name'}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`address.${index}.pinCode`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {'Pincode '} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input maxLength={6} placeholder="Enter pincode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`address.${index}.gpsCoordinates`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'GPS Coordinates '}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter GPS Coordinates" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full h-full flex max-md:flex-col md:items-center gap-5 col-span-2">
              <Button
                type="button"
                onClick={() =>
                  toast.promise(handleLocateClick(index), {
                    pending: 'Locating...',
                    success: 'Location found',
                    error: 'Location not found please provide location access.',
                  })
                }
              >
                <LocateFixedIcon size={20} />
              </Button>
              {addressLineFields.fields.length === index + 1 && (
                <Button type="button" variant={'outline'} onClick={handleAddAddressLine}>
                  Add address line
                </Button>
              )}
              {addressLineFields.fields.length > 1 && index > 0 && (
                <Button type="button" variant={'destructive'} onClick={() => handleDeleteAddressLine(index)}>
                  Remove address line
                </Button>
              )}
            </div>
          </Fragment>
        ))}

        <div className="flex col-span-2  w-full justify-end items-center gap-5  ">
          <VerifyStepData stepName={STEPS_NAMES.ADDRESS} stepsData={fileAddress} />
          <div className="flex justify-end col-span-2 gap-4 my-3">
            <Button type="submit" disabled={loading}>
              {'Save and next'} <ChevronRight />{' '}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
