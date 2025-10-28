import { createSlice } from "@reduxjs/toolkit";
import { TASKS } from "@/redux/actions/types";
import { IRolesTable } from "@/lib/interfaces/tables";
interface rolesInitialState {
  data: IRolesTable[];
  loading: boolean;
  error: any;
  roleFormOpen: boolean;
}
const initialState: rolesInitialState = {
  data: [],
  loading: false,
  error: null,
  roleFormOpen: false,
};
const RolesSlice = createSlice({
  name: TASKS,
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
    setRoleFormOpen(state, action) {
      state.roleFormOpen = action.payload;
    },
  },
});

export const { setData, setLoading, setError, setRoleFormOpen } =
  RolesSlice.actions;
export default RolesSlice.reducer;
