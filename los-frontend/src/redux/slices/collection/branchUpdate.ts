import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BranchState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: BranchState = {
  loading: false,
  error: null,
  success: false,
};

const branchSlice = createSlice({
  name: "collection/branch",
  initialState,
  reducers: {
    updateBranchRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateBranchSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    updateBranchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { updateBranchRequest, updateBranchSuccess, updateBranchFailure } =
  branchSlice.actions;

export default branchSlice.reducer;
