import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RootState } from '@/redux/slices';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export const description = 'A multiple bar chart';

const chartConfig = {
  collectionPercentage: {
    label: 'Collection Percentage',
    color: 'var(--chart-1)',
  },
  resolvedPercentage: {
    label: 'Fully Paid Percentage',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function CollectionReportChart() {
  const { data } = useSelector((state: RootState) => state.collectionDashboardReport);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Collection Chart - Branch Wise</CardTitle>
        <CardDescription>{moment().format('MMMM - YYYY')}</CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        {data?.collectionReportsData.length > 0 ? (
          <div className="w-full h-[200px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.collectionReportsData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="area"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    formatter={(value, name) => {
                      if (name === 'collectionPercentage') {
                        return [`Collection Percentage: ${value}% `];
                      } else {
                        return [`Fully Paid Percentage: ${value}% `];
                      }
                    }}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="collectionPercentage" fill="var(--chart-1)" radius={4} barSize={20} />
                  <Bar dataKey="resolvedPercentage" fill="var(--chart-2)" radius={4} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <div>
            <h1 className="text-center">No data found</h1>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
