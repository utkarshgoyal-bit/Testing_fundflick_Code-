import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RootState } from '@/redux/slices';
import { useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { exportCasesToExcel } from '@/helpers/jsonTocsv';
import moment from 'moment';
import { LabelList, YAxis } from 'recharts';

const chartConfig = {
  totalCases: {
    label: 'Total Cases',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function FollowupReportChart() {
  const { data } = useSelector((state: RootState) => state.collectionDashboardReport);
  const flattenedData: any[] = [];
  const chartData = data?.followUpsReportsData || [];
  const handleExport = () => {
    data?.followUpsReportsData.forEach((areaItem: any) => {
      areaItem.cases.forEach((caseItem: any) => {
        flattenedData.push({
          Area: areaItem.area,
          CaseNo: caseItem.caseNo,
          Customer: caseItem.customer,
          Overdue: caseItem.overdue,
          Address: caseItem.address,
          DueEMI: caseItem.dueEmi,
          DueEMIAmount: caseItem.dueEmiAmount,
        });
      });
    });
    exportCasesToExcel(flattenedData, 'followup-report');
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>Un-followup Chart - Branch wise</span>
          <Button size="sm" className="ml-2" onClick={handleExport}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Export</span>
          </Button>
        </CardTitle>
        <CardDescription>{moment().format('MMMM - YYYY')}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        {chartData?.length > 0 ? (
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <YAxis
                dataKey="area"
                type="category"
                tickLine={false}
                tickMargin={20}
                axisLine={false}
                tickFormatter={(value) => value}
                hide
              />
              <XAxis dataKey="totalCases" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="totalCases" layout="vertical" fill="var(--color-totalCases)" radius={4} barSize={90}>
                <LabelList
                  dataKey="area"
                  position="insideLeft"
                  offset={8}
                  className="text-white fill-white"
                  fontSize={12}
                />
                <LabelList
                  dataKey="totalCases"
                  position="right"
                  offset={8}
                  className="fill-foreground "
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div>
            <h1 className="text-center">No data found</h1>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FollowupReportChart;
