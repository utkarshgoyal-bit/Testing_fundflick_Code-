import { createSlice } from '@reduxjs/toolkit';
import { COLLECTION_DASHBOARD } from '@/redux/actions/types';
import { IDashboardInitialState } from '@/lib/interfaces';

const initialState: IDashboardInitialState = {
  data: null,
  loading: false,
  error: '',
  filters: {
    collectionDay: 'today',
    followupDay: 'today',
  },
};
const collectionDashboardSlice = createSlice({
  name: COLLECTION_DASHBOARD + '/data',
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
    setFilter: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const { setData, setLoading, setError, setFilter } = collectionDashboardSlice.actions;
export default collectionDashboardSlice.reducer;
