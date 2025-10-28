import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import InputPhone from '@/components/ui/phoneInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OCCUPATIONS, STEPS_NAMES } from '@/lib/enums';
// import { Separator } from "@/components/ui/separator";
import { RootState } from '@/redux/store';
import { ADD_CUSTOMER_INCOME_DATA, GET_CUSTOMER_INCOME_DATA } from '@/redux/actions/types';
import { setStepsData } from '@/redux/slices/files';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, ChevronsUpDown } from 'lucide-react';
import { Fragment, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import VerifyStepData from './verifyStepData';
import urlQueryParams from '@/helpers/urlQueryParams';

const FormSchema = z.object({
  customerEmploymentDetails: z.object({
    income: z.number({ required_error: 'Income is required' }).nonnegative('Income must be a positive number'),
    monthlyOtherIncome: z.number().optional(),
    occupation: z.string().min(1, { message: 'Occupation is required' }),
    occupationCategory: z.string().optional(),
    remarks: z.string().optional(),
  }),

  customerOtherInformation: z
    .array(
      z.object({
        officeAddress: z.string().min(5),
        designation: z.string().min(2),
        department: z.string().optional(),
        employeeCode: z.string().optional(),
        website: z
          .string()
          .optional()
          .refine(
            (val) => {
              if (!val) return true;
              return /^https?:\/\/[^\s]+$/.test(val);
            },
            { message: 'Invalid URL' }
          ),

        officeContact: z.string().min(10, {
          message: 'Phone number must be at least 10 characters.',
        }),
        experienceWithCompany: z.union([z.string(), z.number()]),
        retirementAge: z.number(),
        incomeDetailsComments: z.string().optional(),
      })
    )
    .optional(),
  customerOtherFamilyDetails: z
    .array(
      z.object({
        customerType: z.string(),
        relation: z.string(),
        customerDetails: z.object({
          firstName: z.string(),
          middleName: z.string().optional(),
          lastName: z.string(),
          _id: z.string(),
        }),
        income: z.number(),
        occupation: z.string().optional(),
        occupationCategory: z.string().optional(),
        customerOtherFamilyComments: z.string().optional(),
      })
    )
    .optional(),
});

export default function Income() {
  const dispatch = useDispatch();
  const isBackOffice = urlQueryParams('component') == 'back_office';

  const { income, loading } = useSelector((state: RootState) => state.fileIncome);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: income,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch(setStepsData(data));
    dispatch({
      type: ADD_CUSTOMER_INCOME_DATA,
      payload: {
        ...data,
        customerOtherFamilyDetails:
          data?.customerOtherFamilyDetails?.map((item) => ({
            ...item,
            customerDetails: item.customerDetails._id,
          })) || [],
      },
    });
  }

  const othercardFields = useFieldArray({
    control: form.control,
    name: 'customerOtherInformation',
  });

  const handleAddOther = () => {
    othercardFields.append({
      officeAddress: '',
      designation: '',
      department: '',
      employeeCode: '',
      website: '',
      officeContact: '',
      experienceWithCompany: '',
      retirementAge: null as any,
      incomeDetailsComments: '',
    });
  };

  const handleDeletecustomerOtherInformation = (index: number) => {
    othercardFields.remove(index);
  };

  const customerOtherFamilyDetails = useFieldArray({
    control: form.control,
    name: 'customerOtherFamilyDetails',
  });

  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_INCOME_DATA });
  }, [dispatch]);
  useEffect(() => {
    form.reset(income);
  }, [form, income]);

  const CustomerOtherFamilyDetailsHeadings: { [key: string]: string } = {
    'co-applicant': 'Co-applicant Income',
    guarantor: 'Guarantor Income',
    reference: 'Reference Income',
  };
  const order = {
    'co-applicant': 0,
    guarantor: 1,
    reference: 2,
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:grid md:grid-cols-2 relative max-md:space-y-3 gap-3 md:p-5 max-md:px-3"
      >
        <Collapsible className="col-span-2 " defaultOpen>
          <CollapsibleTrigger className="w-full flex justify-between p-2">
            <h2 className="col-span-2 font-bold md:text-xl text-sm w-full text-left">
              Applicant Income{' '}
              <span className=" font-semibold">
                ({income.customerDetails?.firstName} {income.customerDetails?.middleName || ''}{' '}
                {income.customerDetails?.lastName || ''})
              </span>
            </h2>
            <Button type="button" variant={'ghost'}>
              <ChevronsUpDown />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="w-full md:grid md:grid-cols-2 relative max-md:space-y-3 gap-3 md:p-5 max-md:px-3">
            <>
              <>
                {/* <Separator className="col-span-2  bg-secondary" /> */}
               

                <FormField
                  control={form.control}
                  name="customerEmploymentDetails.occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Occupation <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select occupation" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(OCCUPATIONS).map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
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
                  name="customerEmploymentDetails.occupationCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Occupation Category <span className="text-destructive"></span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                          disabled={!form.getValues('customerEmploymentDetails.occupation')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {OCCUPATIONS[
                              form.getValues('customerEmploymentDetails.occupation') as keyof typeof OCCUPATIONS
                            ]?.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
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
                  name="customerEmploymentDetails.income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {'Income From Occupation (Monthly)'}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isBackOffice}
                          type="number"
                          placeholder="Income"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value.length ? +e.target.value : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmploymentDetails.monthlyOtherIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{'Other Income (Monthly)'}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isBackOffice}
                          type="number"
                          value={field.value}
                          placeholder="Rent/Dairy/Agriculture"
                          onChange={(e) => field.onChange(e.target.value.length ? +e.target.value : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmploymentDetails.remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks (if any)</FormLabel>
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
              </>
            </>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible className="col-span-2 " defaultOpen>
          <div className="flex items-center">
            <CollapsibleTrigger className="flex justify-center p-2">
              <h2 className="col-span-2 font-bold md:text-xl text-sm w-full text-left">Additional information</h2>
              {othercardFields.fields.length > 0 && (
                <Button type="button" variant={'ghost'}>
                  {' '}
                  <ChevronsUpDown />
                </Button>
              )}
            </CollapsibleTrigger>
            {!othercardFields.fields.length && (
              <Checkbox onCheckedChange={(check) => (check ? handleAddOther() : null)} />
            )}
          </div>
          <CollapsibleContent className="w-full md:grid md:grid-cols-2 relative max-md:space-y-3 gap-3 md:p-5 max-md:px-3">
            {othercardFields.fields.map((field, index) => (
              <Fragment key={field.id + index}>
                <FormField
                  control={form.control}
                  name={`customerOtherInformation.${index}.officeAddress`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Office Address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter office address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customerOtherInformation.${index}.designation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Designation <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter designation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customerOtherInformation.${index}.department`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customerOtherInformation.${index}.employeeCode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customerOtherInformation.${index}.website`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter website URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customerOtherInformation.${index}.officeContact`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {'Office contact number'} <span className="text-destructive">*</span>{' '}
                      </FormLabel>
                      <FormControl>
                        <InputPhone value={field.value} onChange={field.onChange} country={'in'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customerOtherInformation.${index}.experienceWithCompany`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience with Company</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter experience duration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customerOtherInformation.${index}.retirementAge`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retirement Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter retirement age"
                          onChange={(e) => field.onChange(e.target.value.length ? +e.target.value : null)}
                          value={field.value} // Set the value from the form state
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customerOtherInformation.${index}.incomeDetailsComments`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks (if any)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter any Remarks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full h-full flex  items-center gap-5 col-span-2 max-md:mt-3">
                  <Button
                    type="button"
                    variant={'destructive'}
                    onClick={() => handleDeletecustomerOtherInformation(index)}
                  >
                    Remove Other Fields
                  </Button>
                </div>
              </Fragment>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {customerOtherFamilyDetails.fields &&
          [...customerOtherFamilyDetails.fields]
            .sort((a: any, b: any) => {
              return (order as any)[a.customerType] - (order as any)[b.customerType];
            })
            .map((field, index) => (
              <Collapsible className="col-span-2 " defaultOpen key={field.id}>
                <CollapsibleTrigger className="w-full flex justify-between p-2">
                  <div className="flex gap-2">
                    <h2 className="font-semibold">
                      {CustomerOtherFamilyDetailsHeadings[field.customerType]}:- {field.customerDetails.firstName}{' '}
                      {field.customerDetails.middleName} {field.customerDetails.lastName}
                    </h2>
                    <span>({field.relation})</span>
                  </div>
                  <Button type="button" variant={'ghost'}>
                    {' '}
                    <ChevronsUpDown />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="w-full md:grid md:grid-cols-2 relative max-md:space-y-3 gap-3 md:p-5 max-md:px-3">
                  <Fragment key={field.id}>
                   
                    <FormField
                      control={form.control}
                      name={`customerOtherFamilyDetails.${index}.occupation`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select occupation" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(OCCUPATIONS).map((item) => (
                                  <SelectItem key={item} value={item}>
                                    {item}
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
                      name={`customerOtherFamilyDetails.${index}.occupationCategory`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation Category </FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectContent>
                                  {OCCUPATIONS[
                                    form.getValues(
                                      `customerOtherFamilyDetails.${index}.occupation`
                                    ) as keyof typeof OCCUPATIONS
                                  ]?.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`customerOtherFamilyDetails.${index}.income`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Income <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isBackOffice}
                              value={field.value}
                              type="number"
                              placeholder="Enter Income"
                              onChange={(e) => field.onChange(e.target.value.length ? +e.target.value : null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`customerOtherFamilyDetails.${index}.customerOtherFamilyComments`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remarks (if any)</FormLabel>
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
                  </Fragment>
                </CollapsibleContent>
              </Collapsible>
            ))}
        <div className="flex col-span-2  w-full justify-end items-center gap-5  ">
          <VerifyStepData stepName={STEPS_NAMES.INCOME} stepsData={income} />
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
