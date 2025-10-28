import { FETCH_LOAN_STATISTICS } from '@/redux/actions/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const initialState: any = {
  loading: true,
  error: null,
  data: {},
  total: 0,
};

const fetchAllLoansStatistics = createSlice({
  name: FETCH_LOAN_STATISTICS,
  initialState,
  reducers: {
    setAllLoansStatistics(state, action: PayloadAction<any>) {
      state.data = action.payload.data;
      state.total = action.payload.data.length;
      state.loading = false;
    },
    setFilesStatisticsLoading(state, action: { payload: boolean }) {
      state.loading = action.payload;
    },
    setAllLoansStatisticsError(state, action: { payload: string | null }) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAllLoansStatistics, setFilesStatisticsLoading, setAllLoansStatisticsError } =
  fetchAllLoansStatistics.actions;
export default fetchAllLoansStatistics.reducer;
