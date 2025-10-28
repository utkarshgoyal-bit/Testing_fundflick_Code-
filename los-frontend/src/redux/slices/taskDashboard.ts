import { TaskDashboard } from '@/lib/interfaces';
import { TASKS_DASHBOARD } from '@/redux/actions/types';
import { createSlice } from '@reduxjs/toolkit';
interface tasksDashboardInitialState {
  data: TaskDashboard;
  loading: boolean;
  error: any;
}
const initialState: tasksDashboardInitialState = {
  data: {
    completedTasks: 0,
    incompleteTasks: 0,
    totalTasks: 0,
    assignedToMeTasks: 0,
    dueTodayTasks: 0,
    priorityWiseIncompleteTasks: {
      high: 0,
      medium: 0,
      low: 0,
    },
    statusWiseTasks: {
      pending: 0,
      inProgress: 0,
      underReview: 0,
      rejected: 0,
      onHold: 0,
      completed: 0,
      scheduled: 0,
      overdue: 0,
    },
  },
  loading: false,
  error: null,
};
const TasksDashboardSlice = createSlice({
  name: TASKS_DASHBOARD,
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setData(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setLoading, setError, setData } = TasksDashboardSlice.actions;
export default TasksDashboardSlice.reducer;
