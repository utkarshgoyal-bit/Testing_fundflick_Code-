/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserState, IUserTable } from "@/lib/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IUserState = {
  loading: false,
  dialogLoading: false,
  error: null,
  selectedUser: null,
  tableConfiguration: {
    data: [],
    total: 0,
    tableView: {},
    page: 0,
    sort: [],
  },
};

const UserSlice = createSlice({
  name: "main/user-management",
  initialState,
  reducers: {
    setDialogLoading: (state, action: PayloadAction<boolean>) => {
      state.dialogLoading = action.payload;
    },
    setData(state, action: PayloadAction<IUserTable[]>) {
      state.tableConfiguration.data = action.payload;
      state.loading = false;
    },
    setSelectedUser(state, action: PayloadAction<IUserTable>) {
      state.selectedUser = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setTableFilters(state, action: PayloadAction<any>) {
      state.tableConfiguration = action.payload;
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
  setTableFilters,
  setDialogLoading,
  setSelectedUser,
} = UserSlice.actions;
export default UserSlice.reducer;
