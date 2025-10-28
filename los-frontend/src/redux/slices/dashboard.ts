// In your salesMans slice
import { createSlice } from "@reduxjs/toolkit";
import { DASHBOARD } from "@/redux/actions/types";
interface dashboardInitialState {
  data: any;
  loading: boolean;
  error: string;
}
const initialState: dashboardInitialState = {
  data: null,
  loading: false,
  error: "",
};
const dashboardSlice = createSlice({
  name: DASHBOARD + "/data",
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setData, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
