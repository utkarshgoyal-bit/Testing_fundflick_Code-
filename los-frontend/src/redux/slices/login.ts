import { createSlice } from '@reduxjs/toolkit';
import { LOGIN } from '@/redux/actions/types';
import { IUserInitialState } from '@/lib/interfaces/';
const initialState: IUserInitialState = {
  data: null,
  token: '',
  loading: false,
  error: '',
  isAuthenticated: false,
  role: '',
  permissions: [],
  modules: [],
};
const loginSlice = createSlice({
  name: LOGIN + '/data',
  initialState,
  reducers: {
    setOrganizations: (state, action) => {
      state.organizations = action.payload;
    },
    setData(state, action) {
      state.data = action.payload;
    },
    setModules(state, action) {
      state.modules = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setPermissions(state, action) {
      state.permissions = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
  },
});

export const {
  setData,
  setModules,
  setOrganizations,
  setLoading,
  setRole,
  setToken,
  setError,
  setIsAuthenticated,
  setPermissions,
} = loginSlice.actions;
export default loginSlice.reducer;
