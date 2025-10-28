import { ICaseState } from '@/lib/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ICaseState = {
  data: null,
  loading: false,
  error: null,
};

const caseSlice = createSlice({
  name: 'case',
  initialState,
  reducers: {
    fetchCaseRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCaseSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchCaseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCaseRequest, fetchCaseSuccess, fetchCaseFailure } = caseSlice.actions;
export default caseSlice.reducer;
