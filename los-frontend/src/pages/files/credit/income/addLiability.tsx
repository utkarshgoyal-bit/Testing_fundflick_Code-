import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LOANTYPES } from '@/lib/enums';
import { ADD_CREDIT_LIABILITY_DETAILS } from '@/redux/actions/types';
import { zodResolver } from '@hookform/resolvers/zod';
// import { constants } from "buffer";
import urlQueryParams from '@/helpers/urlQueryParams';
import { ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

const FormSchema = z.object({
  loanType: z.string({ required_error: 'loan Type is required' }).min(1, { message: 'Loan Type is required' }),
  loanAmount: z.coerce
    .number({ required_error: 'Loan Amount is required' })
    .nonnegative({ message: 'Loan Amount is nonnegative field' })
    .min(0, { message: 'Loan Amount is required' }),
  emi: z.coerce.number().nonnegative({ message: 'EMI is nonnegative field' }).min(0, { message: 'EMI is required' }),
  irr: z.coerce.number().min(0, { message: 'IRR is required' }),
  tenure: z.coerce.number().nonnegative({ message: 'Tenure is nonnegative field' }).optional(),
  noOfEmiPaid: z.coerce.number().nonnegative({ message: 'No of Emi Paid is nonnegative field' }).optional(),
  noOfemiLeft: z.coerce.number().nonnegative({ message: 'No of Emi Left is nonnegative field' }).optional(),
  paymentsMade: z.string({ required_error: 'Payments Made is required' }).nonempty('Payments Made Type is required'),
  foreclosure: z.string().optional(),
  comments: z.string().optional(),
});

export default function LiabilityForm({ customer_id }: { defaultValues?: any; customer_id: string }) {
  const isBackOffice = urlQueryParams('component') == 'back_office';
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: ADD_CREDIT_LIABILITY_DETAILS,
      payload: { ...data, customerDetails: customer_id },
    });
  }

  const handleIRRValue = () => {
    const loanAmount = form.getValues(`loanAmount`);
    const emi = form.getValues(`emi`);
    const tenure = form.getValues(`tenure`);
    if (loanAmount && emi && tenure) {
      let lowerRate = 0.0001;
      let upperRate = 1;
      let irr = 0;
      const calculateNPV = (rate: number): number => {
        let npv = 0;
        for (let t = 1; t <= tenure; t++) {
          npv += emi / Math.pow(1 + rate, t);
        }
        return npv - loanAmount;
      };
      const epsilon = 0.00001;
      let iterations = 0;
      while (upperRate - lowerRate > epsilon && iterations < 1000) {
        irr = (upperRate + lowerRate) / 2;
        const npv = calculateNPV(irr);

        if (npv > 0) {
          lowerRate = irr;
        } else {
          upperRate = irr;
        }

        iterations++;
      }
      const annualIRR = irr * 12 * 100;
      form.setValue(`irr`, Number(annualIRR.toFixed(2)));
    }
  };

  const handleTenureValue = (input: 'noOfemiLeft' | 'noOfEmiPaid') => {
    const noOfemiLeft = form.getValues(`noOfemiLeft`);
    const noOfEmiPaid = form.getValues(`noOfEmiPaid`);
    const tenure = form.getValues(`tenure`);
    if (input === 'noOfEmiPaid' && noOfEmiPaid && tenure) {
      form.setValue(`noOfemiLeft`, tenure - noOfEmiPaid);
    }
    if (input === 'noOfemiLeft' && noOfemiLeft && tenure) {
      form.setValue(`noOfEmiPaid`, tenure - noOfemiLeft);
    }
  };
  console.log(form.formState.errors);
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return form.handleSubmit(onSubmit)();
        }}
        className="w-full md:grid md:grid-cols-2 relative max-md:space-y-3 gap-3 md:p-5 max-md:px-3"
      >
        <FormField
          control={form.control}
          name={`loanType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {'Loan Type'} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Loan  Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOANTYPES.map((member, index) => (
                      <SelectItem key={index} value={member.value}>
                        {member.label}
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
          name={`loanAmount`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {'Loan Amount'} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isBackOffice}
                  type="number"
                  placeholder="Loan Amount"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value.length ? +e.target.value : null);
                    handleIRRValue();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`tenure`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'Tenure'} </FormLabel>
              <FormControl>
                <Input
                  disabled={isBackOffice}
                  type="number"
                  placeholder="Tenure"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value.length ? +e.target.value : null);
                    handleIRRValue();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`emi`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {'EMI'} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isBackOffice}
                  type="number"
                  placeholder="EMI"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value.length ? +e.target.value : null);
                    handleIRRValue();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`irr`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {'IRR'} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled
                  placeholder="IRR"
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value.length ? +e.target.value : null;
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`noOfEmiPaid`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'No OF EMI Paid'}</FormLabel>
              <FormControl>
                <Input
                  disabled={isBackOffice}
                  type="number"
                  placeholder="No OF EMI Paid"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value.length ? +e.target.value : null);
                    handleTenureValue('noOfEmiPaid');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`noOfemiLeft`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{' No Of Emi Left(Months Left)'}</FormLabel>
              <FormControl>
                <Input
                  disabled={isBackOffice}
                  type="number"
                  placeholder="Months Left"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value.length ? +e.target.value : null);
                    handleTenureValue('noOfemiLeft');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`paymentsMade`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {'Payments Made Type'}
                <span className="text-destructive"> *</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payments Made Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="ECS">ECS</SelectItem>
                    <SelectItem value="NACH">NACH</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`foreclosure`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'Foreclosure'}</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Foreclosure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`comments`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'Remarks'}</FormLabel>
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
        <div className="flex w-full justify-end col-span-2 gap-4">
          <Button>
            Save <ChevronRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}
