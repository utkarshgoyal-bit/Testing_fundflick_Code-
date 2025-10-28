import { IDepartmentTable } from '@/lib/interfaces';
import { createSlice } from '@reduxjs/toolkit';
import { DEPARTMENT } from '../actions/types';
interface departmentsInitialState {
  data: IDepartmentTable[];
  loading: boolean;
  error: any;
  total: number;
  activePage: number;
}
const initialState: departmentsInitialState = {
  data: [],
  total: 0,
  activePage: 1,
  loading: false,
  error: null,
};
const DepartmentSlice = createSlice({
  name: DEPARTMENT,
  initialState,
  reducers: {
    setTotalDepartments(state, action) {
      state.total = action.payload;
    },
    setDepartmentActivePage(state, action) {
      state.activePage = action.payload;
    },

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

export const { setData, setTotalDepartments, setDepartmentActivePage, setLoading, setError } = DepartmentSlice.actions;
export default DepartmentSlice.reducer;
