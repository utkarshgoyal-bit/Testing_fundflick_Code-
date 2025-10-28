import { createSlice } from '@reduxjs/toolkit';
import { ILoadingState } from '@/lib/interfaces';
import { PayloadAction } from '@reduxjs/toolkit';
const initialState: ILoadingState = {
  loading: false,
  authenticating: false,
  authenticated: false,
  message: '',
};
const publicSlice = createSlice({
  name: 'publicSlice',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<{ loading: boolean; message?: string }>) {
      state.loading = action.payload.loading;
      state.message = action.payload.message || '';
    },
    setAuthLoading(state, action: PayloadAction<{ loading: boolean; message?: string }>) {
      state.authenticating = action.payload.loading;
      state.message = action.payload.message || '';
    },
    setAuthenticated(state, action: PayloadAction<{ loading: boolean; message?: string }>) {
      state.authenticated = action.payload.loading;
      state.message = action.payload.message || '';
    },
  },
});

export const { setLoading, setAuthLoading, setAuthenticated } = publicSlice.actions;
export default publicSlice.reducer;
