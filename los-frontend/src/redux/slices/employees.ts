import { IEmployeeTable } from '@/lib/interfaces/tables';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmployeeState {
  loading: boolean;
  error: string | null;
  selectedEmployee: IEmployeeTable | null
  tableConfiguration: {
    data: any[];
    total: number;
    tableView: any;
    page: number;
    sort: any[];
  }
}

const initialState: EmployeeState = {
  loading: false,
  error: null,
  selectedEmployee: null,
  tableConfiguration: {
    data: [],
    total: 0,
    tableView: {},
    page: 0,
    sort: [],

  }
};

const EmployeeSlice = createSlice({
  name: 'main/employee-management',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<IEmployeeTable[]>) {
      state.tableConfiguration.data = action.payload;
      state.loading = false;
    },
    setSelectedEmployee(state, action: PayloadAction<IEmployeeTable | null>) {
      state.selectedEmployee = action.payload
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
    }
  },
});

export const { setData, setLoading, setError, setTableFilters, setSelectedEmployee } = EmployeeSlice.actions;
export default EmployeeSlice.reducer;
