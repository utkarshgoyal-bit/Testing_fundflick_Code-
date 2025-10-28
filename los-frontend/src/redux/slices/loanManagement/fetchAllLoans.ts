import { FETCH_LOANS } from '@/redux/actions/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const initialState: any = {
  loading: true,
  error: null,
  data: [],
  total: 0,
};

const fetchAllLoans = createSlice({
  name: FETCH_LOANS,
  initialState,
  reducers: {
    setAllLoans(state, action: PayloadAction<any>) {
      state.data = action.payload.data;
      state.total = action.payload.data.length;
      state.loading = false;
    },
    setLoanFilesLoading(state, action: { payload: boolean }) {
      state.loading = action.payload;
    },
    setAllLoansError(state, action: { payload: string | null }) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAllLoans, setLoanFilesLoading, setAllLoansError } = fetchAllLoans.actions;
export default fetchAllLoans.reducer;
