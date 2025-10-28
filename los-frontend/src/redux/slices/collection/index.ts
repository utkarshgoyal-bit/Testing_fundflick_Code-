import { ICollectionTableData, ICollectionTable } from '@/lib/interfaces/tables';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BranchState {
  loading: boolean;
  error: string | null;
  selectedRow: ICollectionTable | null;
  branches: string[];
  tableConfiguration: {
    data: ICollectionTable[] | [];
    total: number;
    page: number;
    filters: { [key: string]: any };
  };
  meta: any;
  activeView: 'table' | 'card';
  activeUploadSection: 0 | 1;
}

const initialState: BranchState = {
  loading: false,
  error: null,
  selectedRow: null,
  branches: [],
  meta: null,
  tableConfiguration: {
    data: [],
    total: 0,
    page: 0,
    filters: {},
  },
  activeView: 'card',
  activeUploadSection: 0,
};

const customerFilesSlice = createSlice({
  name: 'main/file-data',
  initialState,
  reducers: {
    setCollectionData(state, action: PayloadAction<ICollectionTableData>) {
      state.tableConfiguration.data = action.payload.data;
      state.loading = false;
      state.branches = action.payload.branches;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setTableFilters(state, action: PayloadAction<any>) {
      state.tableConfiguration.page = 0;
      state.tableConfiguration.filters = { ...state.tableConfiguration.filters, ...action.payload };
    },
    setBranchSelectedRow(state, action: PayloadAction<ICollectionTable | null>) {
      state.selectedRow = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.tableConfiguration.page = action.payload;
    },
    setTotal(state, action: PayloadAction<number>) {
      state.tableConfiguration.total = action.payload;
    },
    setActiveView(state, action: PayloadAction<'table' | 'card'>) {
      state.activeView = action.payload;
    },
    removeFilterKey(state, action: PayloadAction<string>) {
      delete state.tableConfiguration.filters[action.payload];
    },
    setActiveUploadSection(state, action: PayloadAction<0 | 1>) {
      state.activeUploadSection = action.payload;
    },
    setMeta(state, action: PayloadAction<any>) {
      state.meta = action.payload;
    },
  },
});

export const {
  setMeta,
  setCollectionData,
  setLoading,
  setActiveView,
  removeFilterKey,
  setError,
  setTableFilters,
  setBranchSelectedRow,
  setPage,
  setTotal,
  setActiveUploadSection,
} = customerFilesSlice.actions;
export default customerFilesSlice.reducer;
