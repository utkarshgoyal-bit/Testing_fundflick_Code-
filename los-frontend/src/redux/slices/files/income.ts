import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface incomeDetails {
  loading: boolean;
  income: any;
  error: any;
}

const initialState: incomeDetails = {
  loading: false,
  income: {},
  error: null,
};

const incomeSlice = createSlice({
  name: 'file/income',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<unknown>) {
      state.income = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    resetIncome() {
      return initialState;
    },
  },
});

export const { setData, setLoading, setError, resetIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
