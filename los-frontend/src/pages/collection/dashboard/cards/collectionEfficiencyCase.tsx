import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

export default function CollationEfficiencyCase({
  chartData,
}: {
  chartData: [{ pending: number; completed: number }];
}) {
  const chartConfig = {
    completed: {
      label: 'Completed',
      color: 'var(--chart-2)',
    },
    pending: {
      label: 'Pending',
      color: 'var(--chart-1)',
    },
  };
  if (!chartData || !chartData.length) {
    chartData = [{ pending: 0, completed: 0 }];
  }

  const total =
    (chartData.length && 100 - (chartData[0].pending / (chartData[0].pending + chartData[0].completed)) * 100) || 0;

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[290px]">
      <RadialBarChart data={chartData} endAngle={180} innerRadius={120} cy={180} outerRadius={180}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                      {total.toFixed(2)} %
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                      Collection efficiency
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground">
                      (Case Wise)
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="pending"
          fill="var(--color-pending)"
          stackId="a"
          cornerRadius={2}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="completed"
          stackId="a"
          cornerRadius={2}
          fill="var(--color-completed)"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
