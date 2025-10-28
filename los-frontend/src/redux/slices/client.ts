import { IClient, IClientTable } from '@/lib/interfaces';
import { createSlice } from '@reduxjs/toolkit';
import { CLIENT } from '../actions/types';
interface clientsInitialState {
  data: IClientTable[];
  loading: boolean;
  error: any;
  total: number;
  activePage: number;
  selectedClient: IClient | null;
}
const initialState: clientsInitialState = {
  data: [],
  total: 0,
  activePage: 1,
  loading: false,
  error: null,
  selectedClient: null,
};
const ClientSlice = createSlice({
  name: CLIENT,
  initialState,
  reducers: {
    setSelectedClient(state, action) {
      state.selectedClient = action.payload;
    },
    setTotalClients(state, action) {
      state.total = action.payload;
    },
    setClientActivePage(state, action) {
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

export const { setData, setSelectedClient, setTotalClients, setClientActivePage, setLoading, setError } =
  ClientSlice.actions;
export default ClientSlice.reducer;
