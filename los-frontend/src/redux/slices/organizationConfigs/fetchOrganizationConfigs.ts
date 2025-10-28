import { FETCH_ORGANIZATION_CONFIGS } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const initialState: any = {
  loading: true,
  error: null,
  data: [],
  total: 0,
  orgSettings: [],
};

const fetchOrganizations = createSlice({
  name: FETCH_ORGANIZATION_CONFIGS,
  initialState,
  reducers: {
    setAllOrganizationConfigs(state, action: PayloadAction<any>) {
      state.data = action.payload;
      state.total = action.payload.length;
      state.loading = false;
    },
    setOrganizationConfigSettings(state, action: PayloadAction<any>) {
      state.orgSettings = action.payload;
      state.loading = false;
    },
    setOrganizationConfigsLoading(state, action: { payload: boolean }) {
      state.loading = action.payload;
    },
    setOrganizationConfigsError(state, action: { payload: string | null }) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setAllOrganizationConfigs,
  setOrganizationConfigsLoading,
  setOrganizationConfigsError,
  setOrganizationConfigSettings,
} = fetchOrganizations.actions;
export const getOrganizationSettings = (state: RootState) => state.organizationConfigs.orgSettings;
export default fetchOrganizations.reducer;
