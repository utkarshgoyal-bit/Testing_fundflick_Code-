/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrendingUp } from 'lucide-react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const chartData = [{ month: 'january', negative: 30, positive: 70 }];

const chartConfig = {
  desktop: {
    label: 'positive',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'negative',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function RadialChartBar({
  title,
  date,
  hideFooter,
  hideLabel,
  applicantBehaviourScore,
  hideheader,
}: {
  title?: string;
  date?: string;
  hideFooter?: boolean;
  hideLabel?: boolean;
  applicantBehaviourScore?: any;
  hideheader?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-7 shadow-none border-none bg-transparent justify-center items-center">
      {!hideheader && (
        <CardHeader className="items-center pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{date}</CardDescription>
        </CardHeader>
      )}
      <CardContent className="flex  pb-0 justify-center items-center">
        <ChartContainer config={chartConfig} className="mx-auto w-full h-56 md:h-72 lg:h-56">
          <RadialBarChart data={chartData} endAngle={360} innerRadius={80} outerRadius={130}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              {!hideLabel && (
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {applicantBehaviourScore.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                            {'Behaviour Ranking* '}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-muted-foreground">
                            Representative purposes
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              )}
            </PolarRadiusAxis>
            <RadialBar
              dataKey="negative"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-desktop)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="positive"
              fill="var(--color-mobile)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {!hideFooter && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
        </CardFooter>
      )}
    </Card>
  );
}
