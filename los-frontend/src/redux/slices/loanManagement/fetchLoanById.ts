import { FETCH_LOAN_BY_ID } from '@/redux/actions/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const initialState: any = {
  loading: true,
  error: null,
  data: {
    data: {
      borrower: {},
      emis: [],
    },
  },
};

const fetchLoanById = createSlice({
  name: FETCH_LOAN_BY_ID,
  initialState,
  reducers: {
    setLoanById(state, action: PayloadAction<any>) {
      state.data = action.payload.data;
      state.loading = false;
    },
    setLoanByIdLoading(state, action: { payload: boolean }) {
      state.loading = action.payload;
    },
    setLoanByIdError(state, action: { payload: string | null }) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoanById, setLoanByIdLoading, setLoanByIdError } = fetchLoanById.actions;
export default fetchLoanById.reducer;
