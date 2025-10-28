import { IBranchTable } from '@/lib/interfaces/tables';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBranchState } from '@/lib/interfaces';

const initialState: IBranchState = {
  loading: false,
  error: null,
  selectedBranch: null,
  tableConfiguration: {
    data: [],
    total: 0,
    tableView: {},
    page: 0,
    sort: [],
  },
  loanTypes: [],
};

const customerFilesSlice = createSlice({
  name: 'main/customer-files',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<IBranchTable[]>) {
      state.tableConfiguration.data = action.payload;
      state.loading = false;
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
    setSelectedBranch(state, action: PayloadAction<IBranchTable | null>) {
      state.selectedBranch = action.payload;
    },
    setLoanTypes(state, action: PayloadAction<any>) {
      state.loanTypes = action.payload;
    },
  },
});

export const { setData, setLoading, setError, setTableFilters, setSelectedBranch } = customerFilesSlice.actions;
export default customerFilesSlice.reducer;
