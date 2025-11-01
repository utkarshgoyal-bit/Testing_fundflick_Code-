import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { RootState } from '@/redux/slices';
import { ArrowUpRight, CircleCheckBig, LayoutList, Pickaxe, TimerOff } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function IndividualDashboard({
  setIncompleteTasksFilter,
}: {
  setIncompleteTasksFilter: (filter: 'pending' | 'inProgress') => void;
}) {
  const navigate = useNavigate();
  // const [filter, setFilter] = useState('Month');
  const { data } = useSelector((state: RootState) => state.taskDashboard);
  const { priorityWiseIncompleteTasks, statusWiseTasks } = data;
  const performanceData = [
    { name: 'Pending', value: statusWiseTasks.pending, fill: '#FBBF24' },
    { name: 'In Progress', value: statusWiseTasks.inProgress, fill: '#10B981' },
    { name: 'Overdue', value: statusWiseTasks.overdue, fill: '#EF4444' },
  ];
  const summaryData = [
    {
      label: 'Pending Tasks',
      value: statusWiseTasks.pending,
      borderColor: 'border-green-500',
      color: 'bg-yellow-500',
      onClick: () => navigate(buildOrgRoute(`${ROUTES.TASK_MANAGEMENT}`)),
      icon: <LayoutList className="w-6 h-6 text-text" />,
    },
    {
      label: 'Inprogress Tasks',
      value: statusWiseTasks.inProgress,
      borderColor: 'border-green-500',
      color: 'bg-blue-500',
      onClick: () => navigate(buildOrgRoute(`${ROUTES.TASK_MANAGEMENT}`)),
      icon: <Pickaxe className="w-6 h-6 text-text" />,
    },
    {
      label: 'Overdue Tasks',
      value: statusWiseTasks.overdue,
      borderColor: 'border-orange-400',
      color: 'bg-red-500',
      onClick: () => navigate(buildOrgRoute(`${ROUTES.TASK_MANAGEMENT}`)),
      icon: <TimerOff className="w-6 h-6 text-text" />,
    },
    {
      label: 'Completed Tasks',
      value: statusWiseTasks.completed,
      borderColor: 'border-blue-500',
      color: 'bg-green-500',
      onClick: () => navigate(buildOrgRoute(`${ROUTES.TASK_MANAGEMENT}`)),
      icon: <CircleCheckBig className="w-6 h-6 text-text" />,
    },
  ];

  const incompleteTaskData = [
    { priority: 'low', value: priorityWiseIncompleteTasks.low, fill: 'var(--color-warning)' },
    { priority: 'medium', value: priorityWiseIncompleteTasks.medium, fill: 'var(--color-recurring)' },
    { priority: 'high', value: priorityWiseIncompleteTasks.high, fill: 'var(--color-error)' },
  ];
  const incompleteTaskAnalysisChartConfig = {
    low: {
      label: 'Low',
      color: 'var(--color-warning)',
    },
    medium: {
      label: 'Medium',
      color: 'var(--color-warning)',
    },
    high: {
      label: 'High',
      color: 'hsl(var(--color-error))',
    },
  } satisfies ChartConfig;
  const completedTasksChartConfig = {
    beforeTime: {
      label: 'Before time',
      color: 'var(--color-warning)',
    },
    onTime: {
      label: 'On time',
      color: 'var(--chart-1)',
    },
    delayed: {
      label: 'Delayed',
      color: 'var(--color-error)',
    },
  } satisfies ChartConfig;
  const completedTasksChartData = [
    { month: 'January', beforeTime: 186, onTime: 80, delayed: 50 },
    { month: 'February', beforeTime: 305, onTime: 200, delayed: 150 },
    { month: 'March', beforeTime: 237, onTime: 120, delayed: 250 },
    { month: 'April', beforeTime: 73, onTime: 190, delayed: 90 },
    { month: 'May', beforeTime: 209, onTime: 130, delayed: 10 },
    { month: 'June', beforeTime: 214, onTime: 140, delayed: 110 },
  ];
  return (
    <div className="p-6 bg-white rounded-md shadow-md space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        {summaryData.map((card, index) => (
          <div
            key={index}
            className={`group relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 hover:shadow-lg transition-all duration-300 overflow-hidden ${'cursor-pointer hover:border-color-primary/30'}`}
            onClick={card.onClick}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              <div
                className={`absolute top-0 right-0 w-16 h-16 ${card.color} rounded-full -translate-y-8 translate-x-8`}
              ></div>
              <div
                className={`absolute bottom-0 left-0 w-12 h-12 bg-color-secondary rounded-full translate-y-6 -translate-x-6`}
              ></div>
            </div>

            {/* Subtle Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                backgroundSize: '12px 12px',
              }}
            ></div>

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${'from-color-primary/3 via-transparent to-color-secondary/3'}`}
            ></div>

            {/* Card Header */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className={`p-2 rounded-lg border `}>{card.icon}</div>

              <ArrowUpRight className="h-3 w-3 text-fg-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Card Content */}
            <div className="relative z-10">
              <div className="text-xl font-bold text-fg-primary mb-1 leading-tight">{card.value}</div>
              <div className="flex items-center justify-between text-xs">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Analysis Sections */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-md shadow p-4">
          <h3 className="font-semibold mb-4 text-2xl">Incomplete Task Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <div className="flex justify-between px-4">
              <Tabs defaultValue="pending" className="w-[400px]">
                <TabsList>
                  <TabsTrigger onClick={() => setIncompleteTasksFilter('pending')} value="pending">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger onClick={() => setIncompleteTasksFilter('inProgress')} value="inProgress">
                    In Progress
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                  <ChartContainer
                    config={incompleteTaskAnalysisChartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={incompleteTaskData}
                        dataKey="value"
                        nameKey="priority"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                              return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                  <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                    {Object.values(incompleteTaskData)
                                      .reduce((acc, item) => acc + item.value, 0)
                                      .toLocaleString()}
                                  </tspan>
                                  <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                    Visitors
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </TabsContent>
                <TabsContent value="inProgress">
                  <ChartContainer
                    config={incompleteTaskAnalysisChartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={incompleteTaskData}
                        dataKey="value"
                        nameKey="priority"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                              return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                  <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                    {Object.values(incompleteTaskData)
                                      .reduce((acc, item) => acc + item.value, 0)
                                      .toLocaleString()}
                                  </tspan>
                                  <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                    Visitors
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </TabsContent>
              </Tabs>
              <div>
                <div className=" mt-4 ">
                  {incompleteTaskData.map((entry) => (
                    <div key={entry.priority} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.fill }}></div>
                      <span className="text-lg capitalize">{entry.priority}</span>
                      <span className="text-lg font-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </div>

        {/* Performance Analysis */}
        <div className="bg-white rounded-md shadow p-4">
          <div className="flex flex-row justify-between items-center mb-10 mt-2  ">
            <h1 className="font-bold text-2xl w-1/2 ">Upcoming Task</h1>
            <div className="flex items-center space-x-2 mb-4">
              <span className="flex items-center space-x-1 text-yellow-500">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span>Pending</span>
                <span className="ml-1">{statusWiseTasks.pending}</span>
              </span>
              <span className="flex items-center space-x-3  text-green-600">
                <div className="w-3 h-3 rounded bg-green-600"></div>
                <span>In Progress</span>
                <span className="ml-1">{statusWiseTasks.inProgress}</span>
              </span>

              <span className="flex items-center space-x-1 text-red-600">
                <div className="w-3 h-3 rounded bg-red-600"></div>
                <span>Overdue</span>
                <span className="ml-1">{statusWiseTasks.overdue}</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={performanceData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 100]}
                ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                tickLine={false}
                axisLine={false}
              />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className=" bg-white my-2 rounded-md  p-4 shadow-md">
        <h3 className="font-semibold mb-4 text-2xl">Completed Task Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ChartContainer config={completedTasksChartConfig} className="mx-auto max-h-[300px]">
            <AreaChart
              accessibilityLayer
              data={completedTasksChartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Area
                dataKey="beforeTime"
                type="natural"
                fill="var(--color-beforeTime)"
                fillOpacity={0.4}
                stroke="var(--color-beforeTime)"
                stackId="a"
              />

              <Area
                dataKey="onTime"
                type="natural"
                fill="var(--color-onTime)"
                fillOpacity={0.4}
                stroke="var(--color-onTime)"
                stackId="a"
              />
              <Area
                dataKey="delayed"
                type="natural"
                fill="var(--color-delayed)"
                fillOpacity={0.4}
                stroke="var(--color-delayed)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IndividualDashboard;
