import { IOrganizationAdmin } from '@/lib/interfaces/tables';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrganizationsAdminState {
  loading: boolean;
  error: string | null;
  SelectedOrganization: IOrganizationAdmin | null;
  tableConfiguration: {
    data: IOrganizationAdmin[];
    total: number;
    active: number;
    tableView: any;
    page: number;
    sort: any[];
  };
}

const initialState: OrganizationsAdminState = {
  loading: false,
  error: null,
  SelectedOrganization: null,
  tableConfiguration: {
    data: [],
    total: 0,
    active: 0,
    tableView: {},
    page: 0,
    sort: [],
  },
};

const questionsSlice = createSlice({
  name: 'main/organization-slice',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<OrganizationsAdminState['tableConfiguration']>) {
      state.tableConfiguration = action.payload;
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
    setSelectedOrganization(state, action: PayloadAction<IOrganizationAdmin | null>) {
      state.SelectedOrganization = action.payload;
    },
  },
});

export const { setData, setLoading, setError, setTableFilters, setSelectedOrganization } = questionsSlice.actions;
export default questionsSlice.reducer;
