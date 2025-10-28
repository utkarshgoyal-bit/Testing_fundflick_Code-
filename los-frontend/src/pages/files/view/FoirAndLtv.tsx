import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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

interface FoirProps {
  percentage: number;
}

export function Foir({ percentage }: FoirProps) {
  const getStrokeDashoffset = (percent: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    return circumference - (percent / 100) * circumference;
  };

  return (
    <div>
      <div className="border-b flex justify-between pb-3 mb-5">
        <h2 className="font-bold text-[18px]">FOIR</h2>
        <EllipsisVertical className="hover:cursor-pointer" />
      </div>
      <div className="relative w-60 h-60 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 120 120" className="absolute">
          {[
            { radius: 50, color: '#6941C6' },
            { radius: 40, color: '#7F56D9' },
            { radius: 30, color: '#B692F6' },
          ].map(({ radius, color }, index) => (
            <circle
              key={index}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * radius}
              strokeDashoffset={getStrokeDashoffset(percentage, radius)}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          ))}
        </svg>
        <span className="absolute text-2xl font-bold text-black">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export function Ltv({ ltvPercentage }: { ltvPercentage: number }) {
  const getStrokeDashoffset = (percent: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    return circumference - (percent / 100) * circumference;
  };

  return (
    <div>
      <div className="border-b flex justify-between pb-3 mb-5">
        <h2 className="font-bold text-[18px]">LTV</h2>
        <EllipsisVertical className="hover:cursor-pointer" />
      </div>
      <div className="relative w-60 h-60 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 120 120" className="absolute">
          {[
            { radius: 50, color: '#6941C6' },
            { radius: 40, color: '#7F56D9' },
            { radius: 30, color: '#B692F6' },
          ].map(({ radius, color }, index) => (
            <circle
              key={index}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * radius}
              strokeDashoffset={getStrokeDashoffset(ltvPercentage, radius)}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          ))}
        </svg>
        <span className="absolute text-2xl font-bold text-black">{ltvPercentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}

import { EllipsisVertical } from 'lucide-react';
import moment from 'moment';
import { Bar, BarChart, XAxis } from 'recharts';
// import { useEffect, useState } from "react";

const barChartData = [
  { date: '2024-07-15', running: 450, swimming: 300, jogging: 200 },
  { date: '2024-07-16', running: 380, swimming: 420, jogging: 300 },
  { date: '2024-07-17', running: 520, swimming: 120, jogging: 400 },
  { date: '2024-07-18', running: 140, swimming: 550, jogging: 500 },
  { date: '2024-07-19', running: 600, swimming: 350, jogging: 200 },
  { date: '2024-07-20', running: 480, swimming: 400, jogging: 300 },
  { date: '2024-07-20', running: 480, swimming: 400, jogging: 300 },
  { date: '2024-07-20', running: 480, swimming: 400, jogging: 300 },
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
    <div>
      <ChartContainer config={barChartConfig}>
        <BarChart accessibilityLayer data={barChartData}>
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={5}
            axisLine={false}
            tickFormatter={(value) => {
              return moment(value).format('ddd');
            }}
          />
          <Bar dataKey="running" stackId="a" fill="#6941C6" radius={[0, 0, 4, 4]} />
          <Bar dataKey="swimming" stackId="a" fill="#9E77ED" radius={[4, 4, 0, 0]} />
          <Bar dataKey="jogging" stackId="a" fill="#EAECF0" radius={[4, 4, 0, 0]} />
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
