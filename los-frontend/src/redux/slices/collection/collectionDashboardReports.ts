import { IDashboardReportsInitialState } from '@/lib/interfaces';
import { COLLECTION_DASHBOARD_REPORT } from '@/redux/actions/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: IDashboardReportsInitialState = {
  data: null,
  loading: false,
  error: '',
};
const collectionDashboardReportSlice = createSlice({
  name: COLLECTION_DASHBOARD_REPORT + '/data',
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

export const { setData, setLoading, setError } = collectionDashboardReportSlice.actions;
export default collectionDashboardReportSlice.reducer;
