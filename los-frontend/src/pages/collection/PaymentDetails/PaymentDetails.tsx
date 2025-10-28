import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { CURRENCY_SYMBOLS } from '@/lib/enums';
import { cn, copy } from '@/lib/utils';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar, CalendarIcon, Copy, CreditCard, FileImage, MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const PaymentFormSchema = z.object({
  amount: z.number().min(1, 'Amount is required'),
  isExtraCharges: z.boolean().default(false),
  extraCharges: z.number().optional(),
  date: z.string().min(1, 'Date is required'),
  paymentMode: z.string().min(1, 'Payment mode is required'),
  remarks: z.string().optional(),
  selfie: z.any().optional(),
});

type PaymentFormData = z.infer<typeof PaymentFormSchema>;

const PaymentDetails = ({
  onSubmit,
  dueEmiAmount,
  today,
  yesterday,
  loading,
}: {
  onSubmit: any;
  dueEmiAmount: number;
  today: string;
  yesterday: string;
  loading: boolean;
}) => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('');

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      isExtraCharges: false,
      date: today ? today.split('-').reverse().join('-') : '',
    },
  });

  const isExtraCharges = form.watch('isExtraCharges');

  const handleSubmit = (data: PaymentFormData) => {
    onSubmit(data);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await copy({ text });
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const renderDateField = (name: keyof PaymentFormData, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {label}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                disabled={(date) => {
                  if (yesterday && date < new Date(yesterday.split('-').reverse().join('-'))) return true;
                  if (today && date > new Date(today.split('-').reverse().join('-'))) return true;
                  return false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Amount Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Amount ({CURRENCY_SYMBOLS['INR']} {dueEmiAmount ? `Due: ${dueEmiAmount}` : ''})
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={
                            dueEmiAmount
                              ? `Your Due EMI Amount is ${CURRENCY_SYMBOLS['INR']} ${dueEmiAmount}`
                              : 'Enter amount'
                          }
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Extra Charges */}
                <FormField
                  control={form.control}
                  name="isExtraCharges"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Include Other Charges
                        </FormLabel>
                        <p className="text-sm text-gray-600">
                          Check this if there are additional charges to be collected
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {isExtraCharges && (
                  <FormField
                    control={form.control}
                    name="extraCharges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extra Charges Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter extra charges amount"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="h-12 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Separator />

              {/* Date Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Payment Date
                </h3>
                {renderDateField('date', 'Payment Date')}
              </div>

              <Separator />

              {/* Payment Mode Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Payment Mode</h3>
                </div>
                <FormField
                  control={form.control}
                  name="paymentMode"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedPaymentMode(value);
                          }}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-green-50">
                            <RadioGroupItem value="cash" id="cash" />
                            <label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                              <span className="text-lg">💵</span>
                              <span>Cash</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50">
                            <RadioGroupItem value="netbanking" id="netbanking" />
                            <label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                              <span className="text-lg">🏦</span>
                              <span>Net Banking</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-purple-50">
                            <RadioGroupItem value="qrcode" id="qrcode" />
                            <label htmlFor="qrcode" className="flex items-center gap-2 cursor-pointer flex-1">
                              <span className="text-lg">📱</span>
                              <span>QR Code</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Conditional Payment Details */}
              {selectedPaymentMode === 'netbanking' && (
                <div className="space-y-4 p-6 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="text-base font-semibold text-green-800 mb-4">Bank Transfer Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-600">Company Name:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{import.meta.env.VITE_COMPANY_NAME}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(import.meta.env.VITE_COMPANY_NAME, 'Company name')}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-600">Bank Name:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{import.meta.env.VITE_BANK_NAME}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(import.meta.env.VITE_BANK_NAME, 'Bank name')}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-600">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{import.meta.env.VITE_ACCOUNT_NUMBER}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(import.meta.env.VITE_ACCOUNT_NUMBER, 'Account number')}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-600">IFSC Code:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{import.meta.env.VITE_IFSC_CODE}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(import.meta.env.VITE_IFSC_CODE, 'IFSC code')}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMode === 'qrcode' && (
                <div className="space-y-4 p-6 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <h4 className="text-base font-semibold text-blue-800 mb-4">Scan QR Code to Pay</h4>
                  <div className="flex justify-center">
                    <img src="/QR_CODE.png" alt="QR Code for Payment" className="max-w-[200px] rounded-lg shadow-md" />
                  </div>
                  <p className="text-sm text-blue-600">Scan this QR code with your banking app to make the payment</p>
                </div>
              )}

              <Separator />

              {/* Remarks Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg font-semibold">
                        <MessageSquare className="w-5 h-5" />
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional remarks about the payment..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Selfie Upload Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="selfie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg font-semibold">
                        <FileImage className="w-5 h-5" />
                        Upload Selfie
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => field.onChange(e.target.files)}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-medium hover:file:bg-primary/90"
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">Capture a selfie for payment verification</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="min-w-[200px] h-12">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <I8nTextWrapper text="submit" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetails;
