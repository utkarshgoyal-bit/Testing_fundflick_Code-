import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import NP from 'number-precision';

const MonthlyTargetProgress = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-color-primary" />
          Monthly Target Progress
        </CardTitle>
        <CardDescription>Current month disbursement vs target</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg-secondary">Target</span>
            <span className="font-medium">
              <I8nCurrencyWrapper value={5000000} precision={0} />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg-secondary">Achieved</span>
            <span className="font-medium text-color-success">
              <I8nCurrencyWrapper value={4200000} precision={0} />
            </span>
          </div>
          <Progress value={(5000000 / 4200000) * 100} className="h-2" />
          <p className="text-xs text-fg-secondary">
            {NP.round((4200000 / 5000000) * 100, 0)}% of monthly target achieved
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyTargetProgress;
