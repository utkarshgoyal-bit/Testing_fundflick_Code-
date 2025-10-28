import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RootState } from '@/redux/slices';
import { TrendingUp } from 'lucide-react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Pie, PieChart } from 'recharts';

function generateDistinctColors(count: number): string[] {
  // Theme-based chart colors (excluding dark/black colors)
  const themeColors = [
    'hsl(var(--chart-1))', // #2a9d90 - Teal
    'hsl(var(--chart-2))', // #e76e50 - Orange/Red
    'hsl(var(--chart-4))', // 43 74% 66% - Yellow/Gold
    'hsl(var(--chart-5))', // 27 87% 67% - Orange
    'var(--color-accent)',  // #ffc857 - Yellow accent
    'var(--color-info)',    // Blue
    'var(--color-info2)',   // Light blue
    'var(--color-success)', // Green
    'var(--color-success2)', // Light green
    'var(--color-warning)', // Orange/Yellow
    'var(--color-warning2)', // Light orange/yellow
    'var(--color-error2)',  // Light red
  ];

  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i < themeColors.length) {
      colors.push(themeColors[i]);
    } else {
      // Fallback to generated bright colors (avoiding dark colors)
      const hue = Math.round((360 / count) * i);
      // Use higher lightness values to avoid dark colors
      const lightness = 50 + (i % 3) * 15; // 50%, 65%, or 80%
      colors.push(`hsl(${hue}, 70%, ${lightness}%)`);
    }
  }

  return colors;
}

const chartConfig = {
  totalCases: {
    label: 'Total Cases',
  },
} satisfies ChartConfig;

export function CaseCountReport() {
  const { data } = useSelector((state: RootState) => state.collectionDashboardReport);

  const chartData = data?.collectionReportsData || [];
  const colors = generateDistinctColors(chartData.length);

  const mappedChartData = chartData?.map((item: any, index: number) => ({
    ...item,
    fill: colors[index],
  }));

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Branch wise pending cases -Pie Chart</CardTitle>
        <CardDescription>{moment().format('MMMM - YYYY')}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {data?.collectionReportsData.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto h-[350px] w-[350px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={mappedChartData} dataKey="totalCases" nameKey="area" />
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
          {mappedChartData.length} Branches are available
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
