import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import InputPhone from '@/components/ui/phoneInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiCaller from '@/helpers/apiHelper';
import parseDob from '@/helpers/parseDob';
import { CUSTOMER_TYPE, RELATION_APPLICANT } from '@/lib/enums';
// import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import handleLoadLocalFile from '@/helpers/loadCompressFile';
import { customerResponse } from '@/pages/files/steps/customer';
import { ADD_CUSTOMER_ASSOCIATES_DATA, EDIT_CUSTOMER_ASSOCIATES_DATA } from '@/redux/actions/types';
import { formLoading } from '@/redux/slices/files';
import { RootState } from '@/redux/store';
import GetCoordinates from '@/utils/getCoordinates';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Camera, ChevronDown, ChevronRight, ChevronUp, LocateFixedIcon, Trash } from 'lucide-react';
import moment from 'moment';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { z } from 'zod';

const FormSchema = z.object({
  associate: z
    .object({
      customerType: z.enum(Object.keys(CUSTOMER_TYPE) as [string, string]),
      relation: z.string({ required_error: 'Relation is required' }),
      customerDetails: z.object({
        uidFront: z.any(),
        uidBack: z.any(),
        aadhaarNumber: z.string({ required_error: 'Aadhaar Number is required' }).optional(),
        firstName: z.string({ required_error: 'First Name is required' }),
        middleName: z.string().optional(),
        lastName: z.string({ required_error: 'Last Name is required' }).optional(),
        dob: z.string({ required_error: 'DOB is required' }),
        gender: z.string({ required_error: 'Gender is required' }),
        personalPan: z
          .string()
          .optional() // Make PAN optional
          .refine((val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), {
            message: 'PAN must be in the format AAAAA9999A',
          }),
        voterId: z
          .string()
          .optional()
          .refine((val) => !val || val.length == 10, {
            message: 'Voter ID must be 10 characters',
          }),
        otherId: z
          .string()
          .optional()
          .refine((val) => !val || val.length == 10, {
            message: 'Other ID must be 10 characters',
          }),
        maritalStatus: z.string({ required_error: 'Marital Status is required' }).min(1),
        phone: z.string({ required_error: 'Phone is required' }),
        sameAsApplicant: z.string().optional(),
        address: z.string().optional(),
      }),
      address: z
        .object({
          existingAddress: z.string().optional(),
          pltNo: z.string().optional(),
          addressLine: z.string().optional(),
          addressLineTwo: z.string().optional(),
          state: z.string().optional(),
          city: z.string().optional(),
          pinCode: z.string().optional(),
          gpsCoordinates: z.string().optional(),
        })
        .optional(),
    })
    .refine(
      (data) => {
        const aadhaar = data.customerDetails?.aadhaarNumber || '';
        if (data.customerType !== 'reference') {
          return aadhaar.length === 14;
        }
        const isTempPattern = /^TEMP-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          aadhaar
        );

        return aadhaar.length === 14 || aadhaar.length === 0 || isTempPattern;
      },
      {
        message: 'Aadhaar number is required and must be exactly 12 digits.',
        path: ['customerDetails', 'aadhaarNumber'],
      }
    ),
});

export default function AssociateForm({
  defaultValuesData,
  address,
  status,
}: {
  status?: string;
  address?: any;
  defaultValuesData?: {
    associate?: any;
  };
}) {
  const uidFrontRef = useRef<HTMLInputElement>(null);
  const [isExistingFieldOpen, setIsExistingFieldOpen] = useState(false);
  const dispatch = useDispatch();
  const uidBackRef = useRef<HTMLInputElement>(null);
  const isEditForm = defaultValuesData ? true : false;
  const { stepsData, loading } = useSelector((state: RootState) => state.customerFiles);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValuesData?.associate,
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (isEditForm) {
      return dispatch({
        type: EDIT_CUSTOMER_ASSOCIATES_DATA,
        payload: {
          ...data,
          _id: stepsData._id,
          associate_id: defaultValuesData?.associate._id,
          associate_customer_id: defaultValuesData?.associate.customerDetails._id,
        },
      });
    }
    dispatch({
      type: ADD_CUSTOMER_ASSOCIATES_DATA,
      payload: {
        ...data,
        _id: stepsData._id,
        associate_id: defaultValuesData?.associate._id,
        associate_customer_id: defaultValuesData?.associate.customerDetails._id,
      },
    });
  }

  const handleCameraClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
  };
  async function OCRDataSaga(file: any) {
    dispatch(formLoading(true));
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = apiCaller(
        '/ocr',
        'POST',
        formData,
        true,
        {
          pending: 'Getting aadhaar number and dob ...',
          success: 'Data fetched successfully',
          error: 'Failed to save data',
        },
        {
          'Content-Type': 'multipart/form-data',
        }
      );

      toast.promise(response, {
        pending: 'Getting aadhaar number and dob ...',
        success: {
          render({ data }: any) {
            if (data) {
              console.log(data.data?.aadhaarNumber?.split(' ').join('-'));
              form.setValue('associate.customerDetails.aadhaarNumber', data.data?.aadhaarNumber?.split(' ').join('-'));
              form.setValue('associate.customerDetails.dob', parseDob(data.data.dob) || '');
            }
            return 'Data fetched successfully';
          },
        },
        error: 'Failed to save data',
      });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(formLoading(false));
    }
  }

  const handleCustomerDetails = async (aadhaarNumber: string) => {
    const response = await apiCaller<customerResponse>(
      '/customer-file/file-operations/customer-information?aadhaarNumber=' + aadhaarNumber,
      'GET'
    );
    if (!(response instanceof AxiosError) && response.data) {
      Object.entries(response.data).forEach(([key, value]) => {
        form.setValue(`associate.customerDetails.${key}` as any, value);
      });
    }
  };

  function handleAssociateTypeChange(value: string) {
    const prevType = defaultValuesData?.associate?.customerType || '';
    const isGuarantor = prevType === 'guarantor';
    const isReference = prevType === 'reference';

    if (isEditForm && status && status !== 'Pending') {
      // 1. co-applicant (cannot become guarantor or reference)
      if (value === 'co-applicant') {
        if (isGuarantor || isReference) {
          toast.error('Guarantor or reference  can not be co-applicant');
          return;
        }
      }
      // 2. guarantor (cannot become co-applicant)
      if (isGuarantor) {
        if (value === 'co-applicant') {
          toast.error('Guarantor can not be co-applicant');
          return;
        }
      }
      // 3. reference (cannot become co-applicant or guarantor)
      else if (isReference) {
        if (value === 'co-applicant' || value === 'guarantor') {
          toast.error('Reference can not be co-applicant or guarantor');
          return;
        }
      }
    }

    form.setValue('associate.customerType', value);
  }
  const handleExistingAddressChange = (value: string) => {
    if (value === 'other') {
      return (
        form.setValue('associate.address.existingAddress', ''),
        form.setValue('associate.address.addressLine', ''),
        form.setValue('associate.address.pltNo', ''),
        form.setValue('associate.address.state', ''),
        form.setValue('associate.address.city', ''),
        form.setValue('associate.address.pinCode', '')
      );
    }
    console.log(address);
    address?.map((item: any) => {
      if (item.addressLine === value) {
        return (
          form.setValue('associate.address.existingAddress', value),
          form.setValue('associate.address.addressLine', item.addressLine),
          form.setValue('associate.address.pltNo', item.pltNo),
          form.setValue('associate.address.state', item.state),
          form.setValue('associate.address.city', item.city),
          form.setValue('associate.address.pinCode', item.pinCode),
          form.setValue('associate.address.gpsCoordinates', item.gpsCoordinates)
        );
      }
    });
  };
  const setAddressFields = (address: any) => {
    if (!address) return;

    Object.entries(address).forEach(([key, value]) => {
      const field = `associate.address.${key}`;
      form.setValue(field as any, value || 'N/A');
    });
  };

  const handleLocateClick = async () => {
    return new Promise((resolve, reject) => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const address = await GetCoordinates(latitude, longitude);
              if (address) {
                setAddressFields({ ...address, gpsCoordinates: `${latitude},${longitude}` });
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
  useEffect(() => {
    const aadhaarNumber = form.watch('associate.customerDetails.aadhaarNumber');
    if (aadhaarNumber && aadhaarNumber.length === 14) {
      handleCustomerDetails(aadhaarNumber);
    }
  }, [form.watch('associate.customerDetails.aadhaarNumber')]);
  useEffect(() => {
    form.reset(defaultValuesData);
  }, [defaultValuesData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-2 space-y-4 max-h-[80vh] overflow-auto">
        <Fragment>
          <FormField
            control={form.control}
            name={`associate.customerType`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Associate Type <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={handleAssociateTypeChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select associate with applicant" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(CUSTOMER_TYPE)?.map((customerType: any) => (
                        <SelectItem value={customerType} key={customerType}>
                          {CUSTOMER_TYPE[customerType as keyof typeof CUSTOMER_TYPE]}
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
            name={`associate.relation`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Relation <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Enter relation with applicant" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATION_APPLICANT?.map((relation: any) => (
                        <SelectItem value={relation.value}>{relation.label}</SelectItem>
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
            name={`associate.customerDetails.uidFront`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'Aadhar Card Front'}</FormLabel>
                <FormControl>
                  <div className="bg-white p-3 rounded-md shadow-md flex flex-col gap-3">
                    {(field.value || isEditForm) && (
                      <img
                        className="w-full h-full object-contain"
                        src={
                          isEditForm
                            ? defaultValuesData?.associate?.customerDetails?.uidFront
                            : field.value
                              ? typeof field.value === 'string'
                                ? field.value
                                : URL.createObjectURL(field.value)
                              : ''
                        }
                      />
                    )}
                    <div className="flex  items-center space-x-2">
                      <Input
                        className="max-md:text-sm"
                        type="file"
                        ref={uidFrontRef}
                        accept="image/*" // Allow only image files
                        capture="environment"
                        onChange={async (event) => {
                          field.onChange(await handleLoadLocalFile(event));
                          OCRDataSaga(event.target.files?.[0]);
                        }}
                      />
                      <Button type="button" onClick={() => handleCameraClick(uidFrontRef)}>
                        <Camera />
                      </Button>
                      <Button
                        type="button"
                        variant={'destructive'}
                        onClick={() => {
                          form.setValue('associate.customerDetails.uidFront', '');
                          if (uidFrontRef?.current) uidFrontRef.current.value = '';
                        }}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.uidBack`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'Aadhar Card Back'}</FormLabel>
                <FormControl>
                  <div className="bg-white p-3 rounded-md shadow-md flex flex-col gap-3">
                    {(field.value || isEditForm) && (
                      <img
                        className="w-full h-full object-contain"
                        src={
                          isEditForm
                            ? defaultValuesData?.associate?.customerDetails?.uidBack
                            : field.value
                              ? typeof field.value === 'string'
                                ? field.value
                                : URL.createObjectURL(field.value)
                              : ''
                        }
                      />
                    )}
                    <div className="flex  items-center space-x-2">
                      <Input
                        className="max-md:text-sm"
                        type="file"
                        ref={uidBackRef}
                        accept="image/*" // Allow only image files
                        capture="environment"
                        onChange={async (event) => {
                          field.onChange(await handleLoadLocalFile(event));
                        }}
                      />
                      <Button type="button" onClick={() => handleCameraClick(uidBackRef)}>
                        <Camera />
                      </Button>
                      <Button
                        type="button"
                        variant={'destructive'}
                        onClick={() => {
                          form.setValue('associate.customerDetails.uidBack', '');
                          if (uidBackRef?.current) uidBackRef.current.value = '';
                        }}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.aadhaarNumber`}
            render={({ field }) => {
              const handleAadhaarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4 && value.length <= 8) {
                  value = value.replace(/(\d{4})(\d+)/, '$1-$2');
                } else if (value.length > 8) {
                  value = value.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
                }
                field.onChange(value);
              };
              return (
                <FormItem>
                  <FormLabel className="max-md:text-sm">
                    Aadhaar Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      maxLength={14} // 12 digits + 2 hyphens
                      className="max-md:text-sm"
                      placeholder="Ex:-1234-5678-2345"
                      {...field}
                      onChange={handleAadhaarInputChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.dob`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date of Birth <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="max-md:text-sm"
                    type="date"
                    max={moment().subtract(18, 'years').format('YYYY-MM-DD')}
                    placeholder="Enter DOB"
                    {...field}
                    value={field.value ? moment(field.value).format('YYYY-MM-DD') : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.personalPan`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">PAN Card</FormLabel>
                <FormControl>
                  <Input
                    className="max-md:text-sm"
                    type="text"
                    placeholder="Ex: AAAAA9999A"
                    maxLength={10} // Set max length to 10 characters
                    {...field}
                    onChange={(e) => {
                      const upperValue = e.target.value.toUpperCase();
                      if (upperValue.length <= 10) {
                        // Enforce 10-character limit
                        field.onChange(upperValue);
                      }
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.firstName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.middleName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Middle Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.lastName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`associate.customerDetails.phone`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputPhone className="max-md:text-sm" value={field.value} onChange={field.onChange} country={'in'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`associate.customerDetails.gender`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Gender <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.voterId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voter Id</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Voter Id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.otherId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ration Card</FormLabel>
                <FormControl>
                  <Input placeholder="Ration Card" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`associate.customerDetails.maritalStatus`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Marital Status <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Marital Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unmarried">Unmarried</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Collapsible open={isExistingFieldOpen} onOpenChange={setIsExistingFieldOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between ">
                Existing Address
                {isExistingFieldOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 border my-2 rounded-md">
              <FormField
                control={form.control}
                name={`associate.address.existingAddress`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Address</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          handleExistingAddressChange(value);
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Existing Address" />
                        </SelectTrigger>
                        <SelectContent>
                          {address?.map((item: any, idx: number) => (
                            <SelectItem value={item.addressLine || 'N/A'} key={idx}>
                              {item.addressLine || 'N/A'}
                              {idx === 0 ? ' (Primary)' : ''}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`associate.address.addressLine`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address Line <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address line" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`associate.address.pltNo`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Plot .No ta No. sra No. <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Plot .No" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`associate.address.addressLineTwo`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address line" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`associate.address.state`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      State <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`associate.address.city`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`associate.address.pinCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pin Code <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input maxLength={6} placeholder="Pin Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`associate.address.gpsCoordinates`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPS Coordinates</FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input placeholder="Enter GPS Coordinates" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={() =>
                          toast.promise(handleLocateClick(), {
                            pending: 'Locating...',
                            success: 'Location found',
                            error: 'Location not found please provide location access.',
                          })
                        }
                      >
                        <LocateFixedIcon size={20} />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* --- Collateral/Address Section --- */}

          <Button type="submit" disabled={loading} className="mt-15">
            {'Save and next'} <ChevronRight />{' '}
          </Button>
        </Fragment>
      </form>
    </Form>
  );
}
