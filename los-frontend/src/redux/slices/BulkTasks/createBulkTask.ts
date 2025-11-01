import { ICreateBulkTask } from '@/lib/interfaces/bulkTask.interface';
import { CREATE_BULK_TASK } from '@/redux/actions/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: ICreateBulkTask = {
  data: {
    departmentId: '',
    serviceId: '',
    users: [],
    description: '',
    repeat: '',
    startDate: 0,
    dueAfterDays: '',
    priorityOfTask: '',
  },
  loading: false,
  error: null,
};
const TasksSlice = createSlice({
  name: CREATE_BULK_TASK,
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
} = TasksSlice.actions;
export default TasksSlice.reducer;
