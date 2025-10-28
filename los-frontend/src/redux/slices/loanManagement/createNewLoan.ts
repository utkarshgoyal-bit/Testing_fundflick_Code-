import { IAllLoansFiles } from '@/lib/interfaces';
import { CREATE_LOAN } from '@/redux/actions/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const initialState: IAllLoansFiles = {
  loading: true,
  error: null,
  data: [],
  total: 0,
};

const createNewLoanSlice = createSlice({
  name: CREATE_LOAN,
  initialState,
  reducers: {
    setCreateLoanData(state, action: PayloadAction<IAllLoansFiles>) {
      state.data = action.payload.data;
      state.total = action.payload.total;
      state.loading = false;
    },
    setCreateLoanLoading(state, action: { payload: boolean }) {
      state.loading = action.payload;
    },
    setCreateLoanError(state, action: { payload: string | null }) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCreateLoanData, setCreateLoanLoading, setCreateLoanError } = createNewLoanSlice.actions;
export default createNewLoanSlice.reducer;
