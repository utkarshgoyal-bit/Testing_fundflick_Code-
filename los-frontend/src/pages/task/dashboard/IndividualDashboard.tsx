import { Calendar } from '@/components/ui/calendar';
import { RootState } from '@/redux/slices';
import { format } from 'date-fns';
import React from 'react';
import { BsPersonCheckFill } from 'react-icons/bs';
import { GoTasklist } from 'react-icons/go';
import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

function IndividualDashboard() {
  // const [filter, setFilter] = useState('Month');
  const { data } = useSelector((state: RootState) => state.taskDashboard);
  const {
    // assignedToMeTasks,
    // dueTodayTasks,
    incompleteTasks,
    priorityWiseIncompleteTasks,
    statusWiseTasks,
    totalTasks,
    completedTasks,
  } = data;
  const performanceData = [
    { name: 'On Track', value: statusWiseTasks.inProgress, color: '#10B981' },
    { name: 'Before Time', value: statusWiseTasks.scheduled, color: '#FBBF24' },
    { name: 'Delayed', value: statusWiseTasks.overdue, color: '#EF4444' },
  ];
  const summaryData = [
    {
      title: 'Completed Tasks',
      count: completedTasks,
      borderColor: 'border-green-500',
      iconBg: 'bg-green-500',
      icon: <GoTasklist className="w-6 h-6 text-white" />,
    },
    {
      title: 'Incomplete Tasks',
      count: incompleteTasks,
      borderColor: 'border-orange-400',
      iconBg: 'bg-orange-400',
      icon: <BsPersonCheckFill className="w-6 h-6 text-white" />,
    },
    {
      title: 'Total Tasks',
      count: totalTasks,
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-500',
      icon: <BsPersonCheckFill className="w-6 h-6 text-white" />,
    },
  ];

  const incompleteTaskData = [
    { name: 'Low', value: priorityWiseIncompleteTasks.low, color: '#0C4A6E' },
    { name: 'Medium', value: priorityWiseIncompleteTasks.medium, color: '#FBBF24' },
    { name: 'High', value: priorityWiseIncompleteTasks.high, color: '#A0522D' },
  ];
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  // const filters = ['Default', 'Month', 'Week', 'Yesterday', 'Today'];
  console.log(priorityWiseIncompleteTasks);
  return (
    <div className="p-6 bg-white rounded-md shadow-md space-y-6">
      {/* Top right filter and tabs */}
      {/* <div className="flex justify-end items-center space-x-2 border-b border-gray-200 pb-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        >
          {filters.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">All</button>
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            filter === 'Month' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setFilter('Month')}
        >
          Month
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            filter === 'Week' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setFilter('Week')}
        >
          Week
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            filter === 'Yesterday' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setFilter('Yesterday')}
        >
          Yesterday
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            filter === 'Today' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setFilter('Today')}
        >
          Today
        </button>
        <button className="border border-gray-300 rounded-md p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div> */}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {summaryData.map(({ title, count, borderColor, iconBg, icon }) => (
          <div
            key={title}
            className={`flex items-center justify-between border-b-4 ${borderColor} bg-gray-50 p-4 rounded-md shadow-sm`}
          >
            <div>
              <p className="text-sm font-semibold text-gray-700">{title}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
            <div className={`${iconBg} p-3 rounded-full`}>{icon}</div>
          </div>
        ))}
      </div>

      {/* Analysis Sections */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-md shadow p-4">
          <h3 className="font-semibold mb-4">Incomplete Task Analysis</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incompleteTaskData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0C4A6E" barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Analysis */}
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
                <span>Before Time</span>
                <span className="ml-1">{statusWiseTasks.scheduled}</span>
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

        {/* Calendar */}
        <div className="w-[18rem] bg-white rounded-md shadow p-4 border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => setDate(d)}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
          />
          <h1 className="font-semibold mt-2 underline">{date ? format(date, 'MMMM d, yyyy') : 'No date selected'}</h1>
        </div>
      </div>
    </div>
  );
}

export default IndividualDashboard;
