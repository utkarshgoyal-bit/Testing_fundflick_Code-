import { RootState } from '@/redux/slices';
import { BsCalendar2CheckFill, BsPersonCheckFill } from 'react-icons/bs';
import { GoTasklist } from 'react-icons/go';
import { MdPending } from 'react-icons/md';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
('use client');

const statisticsData = [
  { month: 'Jan', completed: 100, incomplete: 80 },
  { month: 'Feb', completed: 120, incomplete: 90 },
  { month: 'Mar', completed: 150, incomplete: 100 },
  { month: 'Apr', completed: 180, incomplete: 120 },
  { month: 'May', completed: 250, incomplete: 150 },
  { month: 'Jun', completed: 270, incomplete: 200 },
  { month: 'Jul', completed: 260, incomplete: 270 },
  { month: 'Aug', completed: 100, incomplete: 50 },
  { month: 'Sep', completed: 50, incomplete: 30 },
  { month: 'Oct', completed: 20, incomplete: 10 },
  { month: 'Nov', completed: 10, incomplete: 5 },
  { month: 'Dec', completed: 5, incomplete: 2 },
];

const teamIncompleteTasks = [
  { name: 'Anjali Popat', incomplete: 2, completed: 3, total: 5, short: 'AP', color: 'bg-orange-500' },
  { name: 'Diksha Chitroda', incomplete: 263, completed: 3, total: 5, short: 'DC', color: 'bg-yellow-500' },
];

function TeamDashboard() {
  const { data } = useSelector((state: RootState) => state.taskDashboard);
  const {
    assignedToMeTasks,
    dueTodayTasks,
    incompleteTasks,
    priorityWiseIncompleteTasks,
    statusWiseTasks,
    totalTasks,
  } = data;

  const priorityTaskSummaryData = [
    { name: 'Low', value: priorityWiseIncompleteTasks.low, color: '#10B981' },
    { name: 'Medium', value: priorityWiseIncompleteTasks.medium, color: '#FBBF24' },
    { name: 'High', value: priorityWiseIncompleteTasks.high, color: '#EF4444' },
  ];
  const performanceData = [
    { name: 'On Track', value: statusWiseTasks.inProgress, color: '#10B981' },
    { name: 'Before Time', value: statusWiseTasks.scheduled, color: '#FBBF24' },
    { name: 'Delayed', value: statusWiseTasks.overdue, color: '#EF4444' },
  ];

  const totalPendingTasks =
    priorityWiseIncompleteTasks.low + priorityWiseIncompleteTasks.medium + priorityWiseIncompleteTasks.high;

  const overallSummaryData = [
    {
      title: 'Total Task',
      count: totalTasks,
      bgColor: 'bg-teal-500',
      iconColor: 'text-white',
      iconBg: 'bg-teal-600',
      iconPath: 'M9 12h6m-3-3v6',
      icon: <GoTasklist className="w-4 h-4 text-white" />,
    },
    {
      title: 'Assigned to me',
      count: assignedToMeTasks,
      bgColor: 'bg-red-500',
      iconColor: 'text-white',
      iconBg: 'bg-red-600',
      iconPath: 'M12 4v16m8-8H4',
      icon: <BsPersonCheckFill className="w-4 h-4 text-white" />,
    },
    {
      title: 'Due today',
      count: dueTodayTasks,
      bgColor: 'bg-purple-500',
      iconColor: 'text-white',
      iconBg: 'bg-purple-600',
      iconPath: 'M5 13l4 4L19 7',
      icon: <BsCalendar2CheckFill className="w-4 h-4 text-white" />,
    },
    {
      title: 'Incomplete Tasks',
      count: incompleteTasks,
      bgColor: 'bg-orange-500',
      iconColor: 'text-white',
      iconBg: 'bg-orange-600',
      iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      icon: <MdPending className="w-4 h-4 text-white" />,
    },
  ];

  return (
    <div className="p-6  rounded-md shadow-md space-y-6  bg-gray">
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-12">
          {/* Overall Summary */}
          <div className="grid grid-cols-2 gap-4 mt-2 ">
            {overallSummaryData.map(({ title, count, iconColor, iconBg, icon }) => (
              <div key={title} className={`rounded-md p-4 flex flex-row justify-between  items-center bg-white shadow`}>
                <div className="flex flex-row gap-2">
                  <span className={`${iconColor} ${iconBg}  rounded-full p-3 `}>{icon}</span>
                  <p className="text-lg font-semibold mt-1">{title}</p>
                </div>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>

          {/* Statistics Chart */}
          <div className="bg-white rounded-md shadow p-4 border mt-4 ">
            <div className="bg-white rounded-md shadow p-4  flex-1">
              <h3 className="font-semibold mb-4">Team Incomplete Task</h3>
              <table className="w-full text-left ">
                <thead>
                  <tr className="bg-gray">
                    <th className="border-b p-2 ">Name</th>
                    <th className="border-b p-2">Incomplete Task</th>
                    <th className="border-b p-2">Completed Task</th>
                    <th className="border-b p-2">Total</th>
                    <th className="border-b p-2">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {teamIncompleteTasks.map(({ name, incomplete, short, color, completed, total }) => (
                    <tr key={name}>
                      <td className="border-b p-2  ">
                        <span className="flex items-center gap-2">
                          <span className={`p-2 text-sm  ${color} rounded-full text-white`}>{short}</span>
                          {name}
                        </span>
                      </td>
                      <td className="border-b p-2">{incomplete}</td>
                      <td className="border-b p-2">{completed}</td>
                      <td className="border-b p-2">{total}</td>
                      <td className="border-b p-2">{}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-row mt-5 gap-4 ">
            <div className="bg-white rounded-md shadow p-4">
              <div className="flex flex-row justify-between items-center mb-10 mt-2  ">
                <h1 className="font-bold text-2xl w-1/3 ">Performance Analysis</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="flex items-center space-x-3  text-green-600">
                    <div className="w-3 h-3 rounded bg-green-600"></div>
                    <span>On Track</span>
                    <span className="ml-1">{statusWiseTasks.inProgress}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-yellow-500">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span>Pending</span>
                    <span className="ml-1">{statusWiseTasks.pending}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-red-600">
                    <div className="w-3 h-3 rounded bg-red-600"></div>
                    <span>Delayed</span>
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
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Priority Task Summary */}
            <div className="bg-white rounded-md shadow p-4 flex flex-1">
              {/* Left Column - Text Content */}
              <div className="w-1/2 flex flex-col justify-center">
                <h3 className="font-semibold mb-4">Priority Task Summary</h3>

                {/* Show each priority with its value and color */}
                <div className="space-y-2">
                  {priorityTaskSummaryData.map((entry) => (
                    <div key={entry.name} className="flex items-center space-x-2">
                      <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></span>
                      <span className="text-sm font-medium">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total count (previously shown at bottom) */}
                <div className="mt-4 text-xl font-bold">Total: {totalPendingTasks}</div>
              </div>

              {/* Right Column - Pie Chart */}
              <div className="w-1/2 flex justify-center items-center">
                <PieChart width={250} height={250}>
                  <Pie
                    data={priorityTaskSummaryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {priorityTaskSummaryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            {/* Statistics Chart */}
            <div className="flex-1 bg-white rounded-md shadow p-4 border">
              <div className="flex space-x-4 justify-between mt-2 text-sm text-gray-600">
                <h3 className="font-semibold mb-4">Statistics</h3>
                <div className="flex flex-row gap-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>Incomplete</span>
                  </div>
                  <button className="ml-auto border border-gray-300 rounded px-2 py-1 text-xs">Monthly</button>
                  <button className="border border-gray-300 rounded px-2 py-1 text-xs">Weekly</button>
                  <button className="border border-gray-300 rounded px-2 py-1 text-xs">My Task</button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={statisticsData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={3} />
                  <Line type="monotone" dataKey="incomplete" stroke="#EF4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamDashboard;
