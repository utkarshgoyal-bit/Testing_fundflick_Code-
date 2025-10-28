// In your salesMans slice
import { ITaskTable } from '@/lib/interfaces/tables';
import { TASKS } from '@/redux/actions/types';
import { createSlice } from '@reduxjs/toolkit';
interface tasksInitialState {
  data: ITaskTable[];
  loading: boolean;
  unreadCount: number;
  error: any;
  commentLoading: boolean;
  activeTab: 'active' | 'history' | 'all';
  statusFilter: string;
  taskDialogOpen: boolean;
  activeFilter: string;
  total: number;
  activePage: number;
}
const initialState: tasksInitialState = {
  data: [],
  total: 0,
  activePage: 1,
  loading: false,
  unreadCount: 0,
  error: null,
  commentLoading: false,
  activeTab: 'all',
  taskDialogOpen: false,
  activeFilter: 'all',
  statusFilter: 'all',
};
const TasksSlice = createSlice({
  name: TASKS,
  initialState,
  reducers: {
    setTotalTasks(state, action) {
      state.total = action.payload;
    },
    setTaskActivePage(state, action) {
      state.activePage = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setData(state, action) {
      state.data = action.payload;
      state.unreadCount = action.payload.filter((item: any) => !item.readStatus).length;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setCommentLoading(state, action) {
      state.commentLoading = action.payload;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setTaskDialogOpen(state, action) {
      state.taskDialogOpen = action.payload;
    },
    setActiveFilter(state, action) {
      state.activeFilter = action.payload;
    },
  },
});

export const {
  setData,
  setActiveFilter,
  setLoading,
  setError,
  setCommentLoading,
  setActiveTab,
  setTaskDialogOpen,
  setStatusFilter,
  setTaskActivePage,
  setTotalTasks,
} = TasksSlice.actions;
export default TasksSlice.reducer;
