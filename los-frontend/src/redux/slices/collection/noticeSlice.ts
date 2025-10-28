import { createSlice } from '@reduxjs/toolkit';

interface NoticesState {
  loading: boolean;
  error: string | null;
}

const initialState: NoticesState = {
  loading: false,
  error: null,
};

const noticesSlice = createSlice({
  name: 'notices',
  initialState,
  reducers: {
    downloadLegalNoticeRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    downloadLegalNoticeSuccess: (state) => {
      state.loading = false;
    },
    downloadLegalNoticeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    downloadCompanyNoticeRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    downloadCompanyNoticeSuccess: (state) => {
      state.loading = false;
    },
    downloadCompanyNoticeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  downloadLegalNoticeRequest,
  downloadLegalNoticeSuccess,
  downloadLegalNoticeFailure,
  downloadCompanyNoticeRequest,
  downloadCompanyNoticeSuccess,
  downloadCompanyNoticeFailure,
} = noticesSlice.actions;

export default noticesSlice.reducer;
