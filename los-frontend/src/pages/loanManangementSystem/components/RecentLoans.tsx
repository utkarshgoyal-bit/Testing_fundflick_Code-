import GetLoanTypeIcon from '@/components/shared/GetLoanIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import getStatusColor from '@/helpers/getStatusColor';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';
import { Clock, Badge } from 'lucide-react';
const RecentLoans = ({ allLoansFiles }: { allLoansFiles: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-color-secondary" />
          Recent Loans
        </CardTitle>
        <CardDescription>Latest loan applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allLoansFiles.slice(0, 3).map((loan: any) => (
            <div key={loan.id} className="flex items-center justify-between p-3 bg-color-surface-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-color-primary/10 rounded-lg">
                  <GetLoanTypeIcon type={loan.loanType} />
                </div>
                <div>
                  <p className="font-medium text-fg-primary text-sm">{loan.loanNumber}</p>
                  <p className="text-xs text-fg-secondary">{loan.borrowerName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">
                  <I8nCurrencyWrapper value={loan.principalAmount} precision={0} />
                </p>
                <Badge className={`text-xs ${getStatusColor(loan.loanStatus)}`}>{loan.loanStatus}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentLoans;
