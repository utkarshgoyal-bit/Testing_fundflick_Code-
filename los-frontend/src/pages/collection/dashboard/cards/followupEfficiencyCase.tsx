import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

export default function FollowupEfficiencyCase({
  chartData,
  totalUpcomingCollectionFilesCount,
  totalCases,
}: {
  chartData: [{ totalFollowUps: number; totalUpcoming: number }];
  totalCases: number;
  totalUpcomingCollectionFilesCount: number;
}) {
  const chartConfig = {
    totalFollowUps: {
      label: 'Total Follow Up Cases',
      color: 'var(--chart-2)',
    },
    totalUpcoming: {
      label: 'Total unfollowed Cases ',
      color: 'var(--chart-1)',
    },
  };
  if (!chartData || !chartData.length) {
    chartData = [{ totalFollowUps: 0, totalUpcoming: 0 }];
  }
  const customChartdata = [
    {
      totalFollowUps: totalUpcomingCollectionFilesCount,
      totalUpcoming: totalCases - totalUpcomingCollectionFilesCount,
    },
  ];

  // const total = (chartData.length && 100 - (chartData[0].totalNoReply / chartData[0].totalFollowUps) * 100) || 0;
  const total = (chartData.length && (totalUpcomingCollectionFilesCount / totalCases) * 100) || 0;

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[290px]">
      <RadialBarChart data={customChartdata} endAngle={180} innerRadius={120} cy={180} outerRadius={180}>
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
                      Followup efficiency
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
          dataKey="totalUpcoming"
          fill="var(--color-totalUpcoming)"
          stackId="a"
          cornerRadius={2}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="totalFollowUps"
          stackId="a"
          cornerRadius={2}
          fill="var(--color-totalFollowUps)"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
