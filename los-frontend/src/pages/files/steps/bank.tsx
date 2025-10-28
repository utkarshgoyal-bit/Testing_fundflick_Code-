import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import apiCaller from '@/helpers/apiHelper';
import { BANK, ERROR_MESSAGE, STEPS_NAMES } from '@/lib/enums';
import { IFSCCodeResponse } from '@/lib/interfaces/apisResponse.interface';
import { IFamilyMembers } from '@/lib/interfaces/customerFile.interface';
import { ADD_CUSTOMER_BANK_DATA, GET_CUSTOMER_BANK_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import debounce from 'debounce';
import { ChevronRight } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import VerifyStepData from './verifyStepData';
import moment from 'moment';

const FormSchema = z.object({
  bank: z.array(
    z.object({
      bankAccountType: z.string({ required_error: 'Bank account type is required' }).min(2, {
        message: 'Bank account type is required',
      }),
      bankAccountNumber: z.string({ required_error: 'Bank account number is required' }).min(2, {
        message: 'Bank account number is required',
      }),
      bankIFSCCode: z.string({ required_error: 'Bank IFSC code is required' }).regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
        message: 'Invalid IFSC code format',
      }),
      bankName: z.string({ required_error: 'Bank name is required' }).min(2, {
        message: 'Bank name is required',
      }),
      branchName: z.string({ required_error: 'branch Name is required' }).min(2, {
        message: 'branch Name is required',
      }),
      bankAccountHolder: z.string({ required_error: 'Bank account holder is required' }).min(2, {
        message: 'Bank account holder is required',
      }),
    })
  ),

  creditCard: z.array(
    z.object({
      CreditCardHolderID: z.string({ required_error: 'Credit card holder ID is required' }).min(2, {
        message: 'Credit card holder ID is required',
      }),
      CreditCardNumber: z.string({ required_error: 'Credit card number is required' }).min(2, {
        message: 'Credit card number is required',
      }),
      CreditCardType: z.string({ required_error: 'Credit card type is required' }).min(2, {
        message: 'Credit card type is required',
      }),
      CreditCardLimit: z.string({ required_error: 'Credit card limit is required' }).min(2, {
        message: 'Credit card limit is required',
      }),
      CreditCardExpiryDate: z.string({ required_error: 'Credit card expiry date is required' }).min(2, {
        message: 'Credit card expiry date is required',
      }),
    })
  ),
  hasCreditCard: z.boolean().optional().default(false),
});

export default function Bank() {
  const dispatch = useDispatch();
  const { bank: bankData } = useSelector((state: RootState) => state.fileBank);
  const { loading } = useSelector((state: RootState) => state.publicSlice);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: bankData,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: ADD_CUSTOMER_BANK_DATA,
      payload: { ...data, _id: bankData._id },
    });
  }

  const bankFields = useFieldArray({
    control: form.control,
    name: 'bank',
  });

  const creditCardFields = useFieldArray({
    control: form.control,
    name: 'creditCard',
  });

  const handleAddBank = () => {
    bankFields.append({
      bankAccountType: '',
      bankAccountNumber: '',
      bankIFSCCode: '',
      bankName: '',
      branchName: '',
      bankAccountHolder: '',
    });
  };

  const handleAddCreditCard = () => {
    creditCardFields.append({
      CreditCardExpiryDate: '',
      CreditCardHolderID: '',
      CreditCardLimit: '',
      CreditCardNumber: '',
      CreditCardType: '',
    });
  };

  const handleDeleteBank = (index: number) => {
    bankFields.remove(index);
  };

  const handleDeleteCreditCard = (index: number) => {
    creditCardFields.remove(index);
  };

  const debouncedHandleIFSCCodeChange = useCallback(
    debounce(async (value: string, index: number) => {
      if (!value || value.length !== 11) return;
      const response = await apiCaller<IFSCCodeResponse>('/ifsc/' + value, 'GET', {}, true, {
        error: ERROR_MESSAGE.UNEXPECTED,
        success: 'Bank Details Loaded',
        pending: 'Fetching Bank Details...',
      });
      if (!(response instanceof AxiosError) && response.data) {
        form.setValue(`bank.${index}.bankName`, response.data.BANK);
        form.setValue(`bank.${index}.branchName`, response.data.BRANCH);
      }
    }, 800),
    []
  );
  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_BANK_DATA });
  }, []);

  useEffect(() => {
    if (!bankData.bank.length && !bankFields.fields.length) {
      handleAddBank();
    }
  }, [creditCardFields.fields]);

  useEffect(() => {
    form.reset(bankData);
  }, [bankData]);
  if (loading) return null;
  console.log('-->', form.watch('hasCreditCard'));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:grid  md:grid-cols-2 max-md:space-y-3 gap-3 md:p-5  relative"
      >
        <h2 className="col-span-2 font-bold text-xl">Customer Bank Information</h2>
        {bankFields.fields.map((field, index) => (
          <div key={field.id} className="md:col-span-2 md:grid md:grid-cols-2 grid-cols-1 gap-3 max-md:px-2">
            <Separator className="col-span-2  bg-secondary" />
            <FormField
              control={form.control}
              name={`bank.${index}.bankAccountType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Account Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Current">Current</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bank.${index}.bankAccountHolder`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Account Holder <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account holder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bankData?.allFamilyMembers?.map((member: IFamilyMembers) => (
                        <SelectItem key={member._id} value={member._id}>
                          {member?.firstName || ''} {member?.lastName || ''} ({member?.customerType})
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
              name={`bank.${index}.bankIFSCCode`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    IFSC Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      maxLength={11}
                      placeholder="Enter IFSC number"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        field.onChange(value);
                        debouncedHandleIFSCCodeChange(value, index);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bank.${index}.bankAccountNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Account Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`bank.${index}.bankName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bank Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BANK.map((bank) => (
                        <SelectItem key={bank.value} value={bank.value}>
                          {bank.label}
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
              name={`bank.${index}.branchName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Branch Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter branch Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full h-full flex  items-center gap-5 col-span-2 max-md:mt-3">
              {bankFields.fields.length === index + 1 && (
                <Button type="button" variant={'outline'} onClick={handleAddBank}>
                  Add Bank
                </Button>
              )}
              {bankFields.fields.length > 1 && index > 0 && (
                <Button type="button" variant={'destructive'} onClick={() => handleDeleteBank(index)}>
                  Remove Bank
                </Button>
              )}
            </div>
          </div>
        ))}

        <h2 className="col-span-2 font-bold text-xl">Customer Credit Card Information</h2>
        <div className="flex items-center gap-2">
          <h1>Do you have a credit card?</h1>

          <Checkbox
            {...form.register('hasCreditCard')}
            checked={form.watch('hasCreditCard')}
            onCheckedChange={(check) => {
              if (check) {
                form.setValue('hasCreditCard', true);
                handleAddCreditCard();
              } else {
                form.setValue('hasCreditCard', false);
                form.setValue('creditCard', []);
                creditCardFields.remove();
              }
            }}
          />
        </div>
        {creditCardFields.fields.map((field, index) => (
          <div key={field.id} className="md:col-span-2 md:grid grid-cols-2 gap-3 max-md:px-2">
            <Separator className="col-span-2  bg-secondary" />
            <FormField
              control={form.control}
              name={`creditCard.${index}.CreditCardHolderID`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Card Holder ID <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter card holder ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`creditCard.${index}.CreditCardNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Card Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter card number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`creditCard.${index}.CreditCardType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Card Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter card type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`creditCard.${index}.CreditCardLimit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Card Limit <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter card limit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`creditCard.${index}.CreditCardExpiryDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Expiry Date <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ? moment(field.value).format('YYYY-MM-DD') : ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full h-full flex  items-center gap-5 col-span-2 max-md:mt-3">
              {creditCardFields.fields.length === index + 1 && (
                <Button type="button" variant={'outline'} onClick={handleAddCreditCard}>
                  Add Credit Card
                </Button>
              )}
              {creditCardFields.fields.length > 1 && index > 0 && (
                <Button type="button" variant={'destructive'} onClick={() => handleDeleteCreditCard(index)}>
                  Remove Credit Card
                </Button>
              )}
            </div>
          </div>
        ))}
        <div className="flex col-span-2  w-full justify-end items-center gap-5  ">
          <VerifyStepData stepName={STEPS_NAMES.BANK} stepsData={bankData} />
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
