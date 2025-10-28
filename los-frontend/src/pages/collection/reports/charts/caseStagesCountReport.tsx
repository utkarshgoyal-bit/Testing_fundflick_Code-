import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RootState } from '@/redux/slices';
import { TrendingUp } from 'lucide-react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Pie, PieChart } from 'recharts';

function generateDistinctColors(count: number): string[] {
  const colors: string[] = [];

  // Fixed saturation and lightness for visual consistency
  const saturation = 70;
  const lightness = 50;

  for (let i = 0; i < count; i++) {
    const hue = Math.round((360 / count) * i); // Evenly spaced hues
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}

const chartConfig = {
  count: {
    label: 'Total Cases',
  },
} satisfies ChartConfig;

export function StageCaseCountReport() {
  const { data } = useSelector((state: RootState) => state.collectionDashboardReport);

  const chartData = data?.stageWiseReportData.stages || [];
  const colors = generateDistinctColors(chartData.length);

  const mappedChartData = chartData?.map((item: any, index: number) => ({
    ...item,
    fill: colors[index],
  }));

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Stage wise cases - Pie Chart</CardTitle>
        <CardDescription>{moment().format('MMMM - YYYY')}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {data?.collectionReportsData.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto h-[350px] w-[350px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={mappedChartData} dataKey="count" nameKey="stage" />
            </PieChart>
          </ChartContainer>
        ) : (
          <div>
            <h1 className="text-center">No data found</h1>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {mappedChartData.length} stages are available
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
