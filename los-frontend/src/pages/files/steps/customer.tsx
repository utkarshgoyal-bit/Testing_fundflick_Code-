import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import InputPhone from '@/components/ui/phoneInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import apiCaller from '@/helpers/apiHelper';
import { isSuperAdmin } from '@/helpers/checkUserRole';
import handleLoadLocalFile from '@/helpers/loadCompressFile';
import parseDob from '@/helpers/parseDob';
import urlQueryParams from '@/helpers/urlQueryParams';
import { LOANTYPES, STEPS_NAMES } from '@/lib/enums';
import {
  ADD_CUSTOMER_DETAILS_DATA,
  EDIT_CUSTOMER_DETAILS_DATA,
  FETCH_BRANCHES_DATA,
  GET_CUSTOMER_DETAILS_DATA,
} from '@/redux/actions/types';
import { setStepsData } from '@/redux/slices/files';
import { RootState } from '@/redux/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Camera, ChevronRight, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import EMICalculator from './EMICalculator';
import VerifyStepData from './verifyStepData';
import moment from 'moment';
const FormSchema = z.object({
  customerDetails: z.object({
    phone: z.string({ required_error: 'Phone Number is required' }).length(12, {
      message: 'Phone number must be at least 10 characters.',
    }),
    altphone: z
      .string()
      .refine((val) => {
        if (!val || val.length === 2) return true;
        return val.length === 12;
      })
      .optional(),

    uidFront: z.any().optional(),
    uidBack: z.any().optional(),
    aadhaarNumber: z
      .string({ required_error: 'Aadhaar number is required' })
      .length(14, { message: 'Aadhaar number must be exactly 12 digits.' }),
    personalPan: z
      .string({ required_error: 'PAN is required' })
      .length(10, { message: 'PAN must be 10 characters long' })
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
        message: 'PAN must be in the format AAAAA9999A',
      }),
    firstName: z.string({ required_error: 'First name is required' }).min(2, {
      message: 'First name must be at least 2 characters.',
    }),
    middleName: z.string().optional(),
    lastName: z.string({ required_error: 'Last name is required' }).optional(),
    dob: z
      .string({
        required_error: 'Date of birth is requried',
      })
      .min(2, {
        message: 'Date of birth is required',
      }),
    gender: z.string({ required_error: 'Gender is required' }),
    email: z.string().optional(),
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
    nationality: z.string().optional(),
    religion: z.string({ required_error: 'Religion is required' }).optional(),
    education: z.string({ required_error: 'Education is required' }).optional(),
    hasExtraDetails: z.boolean().optional().default(false),
  }),

  loanType: z
    .string({
      required_error: 'Loan Type is required',
    })
    .min(1, { message: 'Loan Type is required' }),

  endUseOfMoney: z
    .string({
      required_error: 'End Use of money is required',
    })
    .optional(),
  loanAmount: z.number({ required_error: 'Loan Amount is required' }).positive('Loan Amount must be a positive number'),
  loanTenure: z.number({ required_error: 'Loan Tenure is required' }).positive('Loan Tenure must be a positive number'),
  emiComfort: z
    .number({ required_error: 'EMI Comfort is required' })
    .nonnegative('EMI Comfort must be a non-negative number'),
  fileBranch: z.string().optional(),
  comments: z.string().optional(),
});
export interface customerResponse {
  aadhaarNumber: string;
  personalPan: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  loanType: string;
  loanAmount: number;
  loanTenure: number;
  emiComfort: number;
  phone: string;
  email: string;
  voterId: string;
  otherId: string;
  nationality: string;
  religion: string;
  education: string;
  hasExtraDetails: boolean;
  comments: string;
}
const getEighteenYearsAgo = () => moment().subtract(18, 'years').format('YYYY-MM-DD');
export default function CustomerDetails() {
  const uidFrontRef = useRef<HTMLInputElement>(null);
  const uidBackRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const isBackOffice = urlQueryParams('component') == 'back_office';
  const queryParams = new URLSearchParams(window.location.search);
  const fileId = queryParams.get('id');
  const isEditForm = queryParams.get('edit') || false;
  const { customerDetails, loading } = useSelector((state: RootState) => state.fileCustomerDetails);
  const { data } = useSelector((state: RootState) => state.login);

  const {
    tableConfiguration: { data: branchData },
  } = useSelector((state: RootState) => state.branch);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...customerDetails,
    },
  });
  const [emiOpen, setEmiOpen] = useState(false);
  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch(setStepsData(data));
    if (isEditForm || isBackOffice) {
      dispatch({
        type: EDIT_CUSTOMER_DETAILS_DATA,
        payload: { ...data, _id: fileId },
      });
      return;
    }
    dispatch({
      type: ADD_CUSTOMER_DETAILS_DATA,
      payload: data,
      navigation,
    });
  }

  const handleCameraClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
  };

  const handleCustomerDetails = async (aadhaarNumber: string) => {
    const response = await apiCaller<customerResponse>(
      '/customer-file/file-operations/customer-information?aadhaarNumber=' + aadhaarNumber,
      'GET'
    );
    if (!(response instanceof AxiosError) && response.data) {
      Object.entries(response.data).forEach(([key, value]) => {
        form.setValue(`customerDetails.${key}` as any, value);
      });
      form.setValue('comments', response.data.comments);
      if (!response.data.hasExtraDetails) {
        extraDetailsCleaner();
      }
    }
  };

  useEffect(() => {
    const value = form.watch('customerDetails.aadhaarNumber');
    if (value?.length == 14) {
      handleCustomerDetails(value);
    }
  }, [form.watch('customerDetails.aadhaarNumber')]);
  useEffect(() => {
    form.reset(customerDetails);
    if (customerDetails.aadhaarNumber) {
      form.setValue('customerDetails.aadhaarNumber', customerDetails.aadhaarNumber);
    }
    if (customerDetails.dob) {
      const dob = parseDob(customerDetails.dob);
      if (dob) {
        form.setValue('customerDetails.dob', dob);
      }
    }
  }, [customerDetails, form]);
  useEffect(() => {
    if (!isEditForm) {
      if (isSuperAdmin(data?.role)) {
        form.setValue('fileBranch', branchData[0]?.name);
      } else {
        form.setValue('fileBranch', data?.branches[0]);
      }
    }
  }, [branchData, data?.user, form, isEditForm]);

  useEffect(() => {
    dispatch({ type: FETCH_BRANCHES_DATA });

    if (isEditForm || isBackOffice) {
      dispatch({
        type: GET_CUSTOMER_DETAILS_DATA,
      });
    }
  }, [dispatch, isBackOffice, isEditForm]);

  function extraDetailsCleaner() {
    form.setValue('customerDetails.voterId', '');
    form.setValue('customerDetails.otherId', '');
    form.setValue('customerDetails.religion', '');
    form.setValue('customerDetails.education', '');
  }
  useEffect(() => {
    if (form.watch('customerDetails.hasExtraDetails') == false) {
      extraDetailsCleaner();
    }
  }, [form.watch('customerDetails.hasExtraDetails'), customerDetails]);
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:grid md:grid-cols-2 relative max-md:space-y-3 gap-3 md:p-5 max-md:px-3"
        >
          <h2 className="col-span-2 font-bold md:text-xl text-sm">Branch of the file</h2>
          <FormField
            control={form.control}
            name="fileBranch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Branch</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch for the file" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branchData?.map((item: any) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <h2 className="col-span-2 font-bold md:text-xl text-sm">Applicant Personal Information</h2>
          <FormField
            control={form.control}
            name="customerDetails.uidFront"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'Aadhar Card Front'}</FormLabel>
                <FormControl>
                  <div className="bg-white p-3 rounded-md shadow-md flex flex-col gap-3">
                    {(field.value || isEditForm) && (
                      <img
                        className="md:min-h-[250px] max-h-[200px] min-h-[200px] md:max-h-[250px]"
                        src={
                          isEditForm
                            ? customerDetails?.customerDetails?.uidFront
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
                        accept="image/*"
                        capture="environment"
                        onChange={async (event) => {
                          field.onChange(await handleLoadLocalFile(event));
                        }}
                      />
                      <Button type="button" onClick={() => handleCameraClick(uidFrontRef)}>
                        <Camera />
                      </Button>
                      <Button
                        type="button"
                        variant={'destructive'}
                        onClick={() => {
                          form.setValue('customerDetails.uidFront', '');
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
            name="customerDetails.uidBack"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'Aadhar Card Back'}</FormLabel>
                <FormControl>
                  <div className="bg-white p-3 rounded-md shadow-md flex flex-col gap-3">
                    {(field.value || isEditForm) && (
                      <img
                        className="md:min-h-[250px] max-h-[200px] min-h-[200px] md:max-h-[250px]"
                        src={
                          isEditForm
                            ? customerDetails?.customerDetails?.uidBack
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
                          form.setValue('customerDetails.uidBack', '');
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
            name="customerDetails.aadhaarNumber"
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
                      disabled={isEditForm ? true : false}
                      maxLength={14} // 12 digits + 2 hyphens
                      className="max-md:text-sm"
                      placeholder="Ex:-1234-5678-2345"
                      {...field}
                      onChange={handleAadhaarInputChange}
                      value={field.value || customerDetails?.aadhaarNumber}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="customerDetails.personalPan"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">
                  PAN Card <span className="text-destructive"> *</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="max-md:text-sm"
                    type="text"
                    disabled={isEditForm ? true : false}
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
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerDetails.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">
                  {'First Name'} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input className="max-md:text-sm" placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerDetails.middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'Middle  Name'}</FormLabel>
                <FormControl>
                  <Input className="max-md:text-sm" placeholder="Enter middle name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerDetails.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'Last Name'}</FormLabel>
                <FormControl>
                  <Input className="max-md:text-sm" placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerDetails.gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">
                  Gender<span className="text-destructive"> *</span>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
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
            name="customerDetails.dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">
                  {'Date of Birth'}
                  <span className="text-destructive"> *</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="max-md:text-sm"
                    type="date"
                    max={getEighteenYearsAgo()}
                    placeholder="Enter dob"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="col-span-2  bg-secondary" />
          <FormField
            control={form.control}
            name="loanType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">
                  Loan Type <span className="text-destructive"> *</span>
                </FormLabel>
                <FormControl>
                  <Select disabled={isBackOffice} onValueChange={(value) => field.onChange(value)} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOANTYPES.map((loan) => {
                        return <SelectItem value={loan.value}>{loan.label}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">
                  {'Loan Amount'}
                  <span className="text-destructive"> *</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isBackOffice}
                    className="max-md:text-sm"
                    type="number"
                    value={field.value}
                    placeholder="Loan Amount"
                    onChange={(e) =>
                      field.onChange(e.target.value.length ? +e.target.value.replace(/[^0-9]/g, '') : null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loanTenure"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">
                  {'Loan Tenure (Months)'} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isBackOffice}
                    className="max-md:text-sm"
                    type="number"
                    value={field.value}
                    placeholder="Loan Tenure"
                    onChange={(e) => field.onChange(e.target.value.length ? +e.target.value : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="max-md:text-sm" type="button" onClick={() => setEmiOpen(true)}>
            {' '}
            EMI
          </Button>
          <FormField
            control={form.control}
            name="emiComfort"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">
                  {'EMI Comfort'} <span className="text-destructive">* </span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isBackOffice}
                    className="max-md:text-sm"
                    placeholder="Monthly EMI"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.length ? +e.target.value : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endUseOfMoney"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'End Use of Money'}</FormLabel>
                <FormControl>
                  <Input disabled={isBackOffice} className="max-md:text-sm" placeholder="End Use of money" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="col-span-2  bg-secondary" />
          <FormField
            control={form.control}
            name="customerDetails.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">
                  {'Phone number'} <span className="text-destructive">*</span>
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
            name="customerDetails.altphone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{' Alternate Phone Number'} </FormLabel>
                <FormControl>
                  <InputPhone className="max-md:text-sm" value={field.value} onChange={field.onChange} country={'in'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerDetails.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'Email address'} </FormLabel>
                <FormControl>
                  <Input className="max-md:text-sm" type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="max-md:text-sm">{'Remarks'} </FormLabel>
                <FormControl>
                  <textarea
                    className="max-md:text-sm block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm leading-6 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Write Remarks"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="col-span-2  bg-secondary" />
          <div className="flex items-center gap-2">
            <h2 className="col-span-2 font-bold text-xl">Additional details</h2>
            {/* <h1>Submit your additional details?</h1> */}
            <input {...form.register('customerDetails.hasExtraDetails')} className="max-md:text-sm" type="checkbox" />
          </div>

          {form.watch('customerDetails.hasExtraDetails') && (
            <div className="col-span-2 md:grid md:grid-cols-2 gap-3">
              <Separator className="col-span-2  bg-secondary" />
              <FormField
                control={form.control}
                name={`customerDetails.voterId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-md:text-sm">Voter Id</FormLabel>
                    <FormControl>
                      <Input className="max-md:text-sm" placeholder="Enter Voter Id" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`customerDetails.otherId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-md:text-sm">Ration Card</FormLabel>
                    <FormControl>
                      <Input className="max-md:text-sm" placeholder="Ration Card" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`customerDetails.nationality`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-md:text-sm">Nationality</FormLabel>
                    <FormControl>
                      <Input className="max-md:text-sm" placeholder="Nationality" {...field} defaultValue="Indian" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`customerDetails.religion`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-md:text-sm">Religion</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Religion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hindu">Hindu</SelectItem>
                          <SelectItem value="Muslim">Muslim</SelectItem>
                          <SelectItem value="Christian">Christian</SelectItem>
                          <SelectItem value="Sikh">Sikh</SelectItem>
                          <SelectItem value="Jain">Jain</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`customerDetails.education`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-md:text-sm">Education Level</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Education Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Uneducated">Uneducated</SelectItem>
                          <SelectItem value="10pass">10th Pass</SelectItem>
                          <SelectItem value="12pass">12th Pass</SelectItem>
                          <SelectItem value="Under-Grad">Under-Grad</SelectItem>
                          <SelectItem value="PostGradPhd">Post Grad</SelectItem>
                          <SelectItem value="Phd">PHD</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex  w-full justify-end items-center gap-5 col-span-2 ">
            <VerifyStepData stepName={STEPS_NAMES.CUSTOMER} stepsData={customerDetails} />
            <div className="flex justify-end col-span-2 gap-4 my-3">
              <Button type="submit" disabled={loading}>
                {'Save and next'} <ChevronRight />{' '}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <Dialog open={emiOpen} onOpenChange={() => setEmiOpen(!emiOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              <div className="p-3">
                <EMICalculator
                  principalAmount={form.getValues('loanAmount')}
                  loanTenure={form.getValues('loanTenure')}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
