import { Button } from '@/components/ui/button'; // ShadCN UI Button component
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // ShadCN UI Card component
import { Input } from '@/components/ui/input'; // ShadCN UI Input component
import { Textarea } from '@/components/ui/textarea';
import { FILE_STATUS } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { SUBMIT_CUSTOMER__STATUS } from '@/redux/actions/types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
export default function SalesManReviewForm({
  loanApplicationNumber,
  status,
  loanAmount,
}: {
  loanApplicationNumber: string;
  status?: FILE_STATUS.APPROVED | FILE_STATUS.REJECTED | FILE_STATUS.REVIEW;
  loanAmount: number;
}) {
  const [principal, setPrincipal] = useState<string | number>(0);
  const [rate, setRate] = useState<string>('');
  const [tenure, setTenure] = useState<string>('');
  const [tenureType, setTenureType] = useState<'months' | 'years'>('months');
  const [emi, setEmi] = useState<number | null>(null);
  const [approveOrRejectRemarks, setApproveOrRejectRemarks] = useState<string>('');
  const dispatch = useDispatch();

  const calculateEMI = () => {
    if (principal && rate && tenure) {
      const monthlyRate = +rate / 12 / 100;
      const totalMonths = tenureType === 'years' ? +tenure * 12 : tenure;
      const emiValue =
        (+principal * +monthlyRate * Math.pow(1 + monthlyRate, +totalMonths)) /
        (Math.pow(1 + +monthlyRate, +totalMonths) - 1);

      setEmi(emiValue);
    }
  };

  const toggleTenureType = (type: 'months' | 'years') => {
    if (type !== tenureType && tenure) {
      // Convert tenure value based on the selected tenure type
      setTenure((type === 'years' ? Math.round(+tenure / 12) : +tenure * 12).toString());
    }
    setTenureType(type);
  };

  const onSubmit = () => {
    if ((status == FILE_STATUS.REJECTED && approveOrRejectRemarks) || (principal && rate && tenure)) {
      dispatch({
        type: SUBMIT_CUSTOMER__STATUS,
        payload: {
          status: status || 'Review',
          loanApplicationNumber: loanApplicationNumber,
          data: {
            principalAmount: principal,
            interestRate: rate,
            loanTenure: tenure,
            emi: emi,
            tenureType: tenureType,
            approveOrRejectRemarks: approveOrRejectRemarks,
          },
        },
      });
    } else {
      toast.error('Please fill all the fields');
    }
  };

  return (
    <Card className="w-full  shadow-lg bg-white">
      <CardHeader className="text-center text-lg font-bold my-3">Report</CardHeader>

      <CardContent className="space-y-4">
        {status != FILE_STATUS.REJECTED && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Principal Amount (₹) <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="Enter loan amount"
              className="w-full border border-gray-300 rounded"
            />
            <p className={cn('text-sm text-gray-500', +principal > +loanAmount ? 'text-destructive' : '')}>
              Original Loan amount: ₹ {loanAmount}
            </p>
          </div>
        )}
        {status != FILE_STATUS.REJECTED && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              IRR(Annual %) <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter annual interest rate"
              className="w-full border border-gray-300 rounded"
            />
          </div>
        )}
        {status != FILE_STATUS.REJECTED && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tenure <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder={`Enter tenure in ${tenureType}`}
                className="w-full border border-gray-300 rounded"
              />
              <Button
                variant={tenureType === 'months' ? 'default' : 'outline'}
                onClick={() => toggleTenureType('months')}
              >
                Months
              </Button>
              <Button
                variant={tenureType === 'years' ? 'default' : 'outline'}
                onClick={() => toggleTenureType('years')}
              >
                Years
              </Button>
            </div>
          </div>
        )}
        {[FILE_STATUS.APPROVED, FILE_STATUS.REJECTED].includes(status as FILE_STATUS) && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Remarks <span className="text-destructive">*</span>
              </label>
              <Textarea
                required
                minLength={5}
                value={approveOrRejectRemarks}
                onChange={(e) => setApproveOrRejectRemarks(e.target.value)}
                placeholder="Enter annual interest rate"
                className="w-full border border-gray-300 rounded"
              />
            </div>
          </>
        )}
        {
          <div className="flex justify-between mt-4">
            {status != FILE_STATUS.REJECTED && (
              <Button
                variant={emi?.toString().length ? 'outline' : 'default'}
                disabled={!principal || !rate || !tenure}
                onClick={calculateEMI}
                className={cn('w-full mr-2')}
              >
                Calculate EMI
              </Button>
            )}
            {(status == FILE_STATUS.REJECTED || emi?.toString().length) && (
              <Button
                variant="outline"
                onClick={onSubmit}
                className={cn(
                  'w-full mr-2',
                  status == FILE_STATUS.APPROVED
                    ? 'bg-success hover:bg-success text-secondary-foreground hover:text-secondary-foreground'
                    : status == FILE_STATUS.REJECTED
                      ? 'bg-destructive hover:bg-destructive text-secondary-foreground hover:text-secondary-foreground'
                      : ''
                )}
              >
                {status == FILE_STATUS.APPROVED
                  ? 'Approve'
                  : status == FILE_STATUS.REJECTED
                    ? 'Reject'
                    : 'Send for Review'}
              </Button>
            )}
          </div>
        }

        {emi !== null && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-700">
              Monthly EMI: <span className="font-bold text-blue-600">₹{emi.toFixed(2)}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
