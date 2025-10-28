import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import moment from 'moment';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';

import { CalendarDays, DollarSign, Receipt, Calculator, CheckCircle } from 'lucide-react';

const paymentSchema = z.object({
  loanId: z.number(),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['CASH', 'CHEQUE', 'UPI', 'NEFT', 'RTGS', 'BANK_TRANSFER', 'AUTO_DEBIT']),
  paymentType: z.enum(['EMI_PAYMENT', 'BULK_PAYMENT', 'PENALTY_PAYMENT', 'PRINCIPAL_PREPAYMENT']).optional(),
  paymentDate: z.date().optional(),
  transactionId: z.string().optional(),
  chequeNumber: z.string().optional(),
  chequeDate: z.date().optional(),
  bankName: z.string().optional(),
  remarks: z.string().optional(),
  specificEMIId: z.number().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: {
    id: number;
    loanNumber: string;
    borrowerName: string;
    emiAmount: number;
    outstandingAmount: number;
    nextEMIDueDate: string;
  } | null;
  onSubmit: (data: PaymentFormData) => Promise<void>;
}

const PaymentRecordModal: React.FC<PaymentRecordModalProps> = ({ isOpen, onClose, loan, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [paymentBreakdown, setPaymentBreakdown] = useState<{
    totalPrincipal: number;
    totalInterest: number;
    totalPenalty: number;
    affectedEMIs: number;
    excessAmount: number;
  } | null>(null);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      loanId: loan?.id || 0,
      amount: loan?.emiAmount || 0,
      paymentMethod: 'CASH',
      paymentType: 'EMI_PAYMENT',
      paymentDate: new Date(),
    },
  });

  const watchedAmount = form.watch('amount');
  const watchedPaymentMethod = form.watch('paymentMethod');

  // Calculate payment breakdown when amount changes
  React.useEffect(() => {
    if (watchedAmount > 0 && loan) {
      calculatePaymentBreakdown(loan.id, watchedAmount);
    }
  }, [watchedAmount, loan]);

  const calculatePaymentBreakdown = async (_: number, amount: number) => {
    try {
      // Mock API call - replace with actual API
      const breakdown = {
        totalPrincipal: Math.round(amount * 0.6),
        totalInterest: Math.round(amount * 0.35),
        totalPenalty: Math.round(amount * 0.05),
        affectedEMIs: Math.ceil(amount / (loan?.emiAmount || 1)),
        excessAmount: Math.max(0, amount - (loan?.outstandingAmount || 0)),
      };
      setPaymentBreakdown(breakdown);
    } catch (error) {
      console.error('Error calculating payment breakdown:', error);
    }
  };

  const handleSubmit = async (data: PaymentFormData) => {
    if (!loan) return;

    setLoading(true);
    try {
      await onSubmit({
        ...data,
        loanId: loan.id,
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error recording payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const requiresChequeDetails = watchedPaymentMethod === 'CHEQUE';
  const requiresTransactionId = ['UPI', 'NEFT', 'RTGS', 'BANK_TRANSFER'].includes(watchedPaymentMethod);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Record Payment - {loan?.loanNumber}
          </DialogTitle>
        </DialogHeader>

        {loan && (
          <div className="space-y-6">
            {/* Loan Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-fg-secondary">Borrower</p>
                  <p className="font-medium">{loan.borrowerName}</p>
                </div>
                <div>
                  <p className="text-sm text-fg-secondary">EMI Amount</p>
                  <p className="font-medium">
                    <I8nCurrencyWrapper value={loan.emiAmount} precision={0} />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-fg-secondary">Outstanding</p>
                  <p className="font-medium text-color-warning">
                    <I8nCurrencyWrapper value={loan.outstandingAmount} precision={0} />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-fg-secondary">Next Due</p>
                  <p className="font-medium">{moment(loan.nextEMIDueDate).format('DD MMM YYYY')}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Details</CardTitle>
                  <CardDescription>Enter payment information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      {/* Amount */}
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Amount *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-fg-tertiary" />
                                <Input
                                  placeholder="Enter amount"
                                  type="number"
                                  step="0.01"
                                  className="pl-10"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Payment Method */}
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CASH">Cash</SelectItem>
                                <SelectItem value="CHEQUE">Cheque</SelectItem>
                                <SelectItem value="UPI">UPI</SelectItem>
                                <SelectItem value="NEFT">NEFT</SelectItem>
                                <SelectItem value="RTGS">RTGS</SelectItem>
                                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                <SelectItem value="AUTO_DEBIT">Auto Debit</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Payment Type */}
                      <FormField
                        control={form.control}
                        name="paymentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="EMI_PAYMENT">EMI Payment</SelectItem>
                                <SelectItem value="BULK_PAYMENT">Bulk Payment</SelectItem>
                                <SelectItem value="PENALTY_PAYMENT">Penalty Payment</SelectItem>
                                <SelectItem value="PRINCIPAL_PREPAYMENT">Principal Prepayment</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Payment Date */}
                      <FormField
                        control={form.control}
                        name="paymentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Payment Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline" className="w-full pl-3 text-left font-normal">
                                    {field.value ? moment(field.value).format('DD MMM YYYY') : <span>Pick a date</span>}
                                    <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Cheque Details */}
                      {requiresChequeDetails && (
                        <>
                          <FormField
                            control={form.control}
                            name="chequeNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cheque Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter cheque number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="chequeDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Cheque Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button variant="outline" className="w-full pl-3 text-left font-normal">
                                        {field.value ? (
                                          moment(field.value).format('DD MMM YYYY')
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter bank name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {/* Transaction ID */}
                      {requiresTransactionId && (
                        <FormField
                          control={form.control}
                          name="transactionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter transaction ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Remarks */}
                      <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter any additional remarks" className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Payment Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Payment Breakdown
                  </CardTitle>
                  <CardDescription>How this payment will be allocated</CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentBreakdown ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-fg-secondary">Principal</p>
                          <p className="text-lg font-bold text-color-primary">
                            <I8nCurrencyWrapper value={paymentBreakdown.totalPrincipal} precision={0} />
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-fg-secondary">Interest</p>
                          <p className="text-lg font-bold text-color-secondary">
                            <I8nCurrencyWrapper value={paymentBreakdown.totalInterest} precision={0} />
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-fg-secondary">Penalty</p>
                          <p className="text-lg font-bold text-color-warning">
                            <I8nCurrencyWrapper value={paymentBreakdown.totalPenalty} precision={0} />
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-fg-secondary">EMIs Covered</p>
                          <p className="text-lg font-bold text-fg-primary">{paymentBreakdown.affectedEMIs}</p>
                        </div>
                      </div>

                      {paymentBreakdown.excessAmount > 0 && (
                        <div className="p-3 bg-color-success/10 rounded-lg border border-color-success/20">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-color-success" />
                            <span className="text-sm font-medium text-color-success">Excess Amount</span>
                          </div>
                          <p className="text-sm text-fg-secondary">
                            <I8nCurrencyWrapper value={paymentBreakdown.excessAmount} precision={0} /> will be adjusted
                            towards future EMIs
                          </p>
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium">Total Payment</span>
                          <span className="text-xl font-bold text-color-primary">
                            <I8nCurrencyWrapper value={watchedAmount} precision={0} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Calculator className="h-8 w-8 text-fg-tertiary mx-auto mb-2" />
                      <p className="text-fg-secondary">Enter payment amount to see breakdown</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(handleSubmit)}
                disabled={loading || !form.formState.isValid}
                className="bg-color-primary hover:bg-color-primary-light"
              >
                {loading ? 'Recording...' : 'Record Payment'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentRecordModal;
