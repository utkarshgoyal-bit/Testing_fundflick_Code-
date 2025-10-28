import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

export default function CollationEfficiencyAmount({
  chartData,
}: {
  chartData?: { totalDueEmiAmount: number; paidAmount: number }[];
}) {
  const chartConfig = {
    totalDueEmiAmount: {
      label: 'Due Emi Amount',
      color: 'var(--chart-1)',
    },
    paidAmount: {
      label: 'Paid Emi Amount',
      color: 'var(--chart-2)',
    },
  };
  if (!chartData || !chartData.length) {
    chartData = [{ totalDueEmiAmount: 0, paidAmount: 0 }];
  }

  const total =
    (chartData?.length &&
      (chartData[0].paidAmount / (chartData[0].totalDueEmiAmount + chartData[0].paidAmount)) * 100) ||
    0;
  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[290px]">
      <RadialBarChart
        data={[
          {
            totalDueEmiAmount: chartData[0].totalDueEmiAmount,
            paidAmount: chartData[0].paidAmount || 0,
          },
        ]}
        endAngle={180}
        innerRadius={120}
        cy={180}
        outerRadius={180}
      >
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
                      (Amount Wise)
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="totalDueEmiAmount"
          fill="var(--color-totalDueEmiAmount)"
          stackId="a"
          cornerRadius={2}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="paidAmount"
          stackId="a"
          cornerRadius={2}
          fill="var(--color-paidAmount)"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
