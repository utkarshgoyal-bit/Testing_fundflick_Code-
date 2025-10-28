import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFollowUpState } from '@/lib/interfaces';
const initialState: IFollowUpState = {
  refCaseId: null,
  loading: false,
  error: null,
};

const followUpSlice = createSlice({
  name: 'followUp',
  initialState,

  reducers: {
    fetchFollowUpRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },

    fetchfolloupSuccess: (state, action: PayloadAction<{ refCaseId: string }>) => {
      state.refCaseId = action.payload.refCaseId;
      state.loading = false;
    },

    fetchFolloUpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    submitFollowUpRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    submitFollowUpSuccess: (state) => {
      state.loading = false;
    },
    submitFollowUpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchFollowUpRequest,
  fetchfolloupSuccess,
  fetchFolloUpFailure,
  submitFollowUpRequest,
  submitFollowUpSuccess,
  submitFollowUpFailure,
} = followUpSlice.actions;
export default followUpSlice.reducer;
