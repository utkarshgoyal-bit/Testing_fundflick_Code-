import { RadialBar, RadialBarChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const chartData = [
  { browser: 'chrome', visitors: 25, fill: '#B692F6' },
  { browser: 'safari', visitors: 20, fill: '#7F56D9' },
  { browser: 'firefox', visitors: 17, fill: '#6941C6' },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function Foir() {
  return (
    <div>
      <div className="border-b flex justify-between pb-3 mb-5">
        <h2 className="  font-bold  text-[18px]">FOIR</h2>
        <EllipsisVertical className="hover:cursor-pointer" />
      </div>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square min-w-[290px]">
        <RadialBarChart data={chartData} innerRadius={70} outerRadius={160}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="browser" />} />
          <RadialBar dataKey="visitors" background />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}

export function Ltv() {
  return (
    <div>
      <div className="border-b flex justify-between pb-3 mb-3">
        <h2 className="  font-bold  text-[18px]">LTV</h2>
        <EllipsisVertical className="hover:cursor-pointer" />
      </div>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square min-w-[290px]">
        <RadialBarChart data={chartData} innerRadius={70} outerRadius={160}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="browser" />} />
          <RadialBar dataKey="visitors" background />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}

import { EllipsisVertical } from 'lucide-react';
import { Bar, BarChart, XAxis } from 'recharts';
import moment from 'moment';

const barChartData = [
  { date: '2024-07-15', running: 450, swimming: 300, jogging: 200 },
  { date: '2024-07-16', running: 380, swimming: 420, jogging: 300 },
  { date: '2024-07-17', running: 520, swimming: 120, jogging: 400 },
  { date: '2024-07-18', running: 140, swimming: 550, jogging: 500 },
  { date: '2024-07-19', running: 600, swimming: 350, jogging: 200 },
  { date: '2024-07-20', running: 480, swimming: 400, jogging: 300 },
  { date: '2024-07-20', running: 480, swimming: 400, jogging: 300 },
];

const barChartConfig = {
  running: {
    label: 'Running',
    color: 'hsl(var(--chart-1))',
  },
  swimming: {
    label: 'Swimming',
    color: 'hsl(var(--chart-2))',
  },
  jogging: {
    label: 'jogging',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function BalanceBarChart() {
  return (
    <div className="w-[90%]  overflow-hidden mx-auto">
      <ChartContainer config={barChartConfig}>
        <BarChart accessibilityLayer data={barChartData}>
          <XAxis
            dataKey="date"
            tickLine={false}
            tickSize={12}
            width={12}
            tickMargin={5}
            axisLine={false}
            tickFormatter={(value) => {
              return moment(value).format('ddd');
            }}
          />
          <Bar dataKey="running" stackId="a" fill="#6941C6" radius={[0, 0, 4, 4]} className="" />
          <Bar dataKey="swimming" stackId="b" fill="#9E77ED" radius={[4, 4, 0, 0]} />

          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                className="w-[180px]"
                formatter={(value, name, item, index) => (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                      style={
                        {
                          '--color-bg': `var(--color-${name})`,
                        } as React.CSSProperties
                      }
                    />
                    {chartConfig[name as keyof typeof chartConfig]?.label || name}
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {value}
                      <span className="font-normal text-muted-foreground">kcal</span>
                    </div>
                    {/* Add this after the last item */}
                    {index === 1 && (
                      <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                        Total
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {item.payload.running + item.payload.swimming}
                          <span className="font-normal text-muted-foreground">kcal</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              />
            }
            cursor={false}
            defaultIndex={1}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
