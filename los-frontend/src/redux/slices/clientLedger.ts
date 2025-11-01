import { ClientLedgerData, SelectedClientLedger } from '@/lib/interfaces';
import { CLIENT_LEDGER } from '@/redux/actions/types';
import { createSlice } from '@reduxjs/toolkit';
interface clientLedgerInitialState {
  data?: ClientLedgerData[];
  selectedClientLedger?: SelectedClientLedger;
  loading: boolean;
  error: any;
}
const initialState: clientLedgerInitialState = {
  loading: false,
  error: null,
};
const ClientLedgerSlice = createSlice({
  name: CLIENT_LEDGER,
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setClientLedgerData(state, action) {
      state.data = action.payload;
    },
    setSelectedClientLedger(state, action) {
      state.selectedClientLedger = action.payload;
    },
  },
});

export const { setLoading, setError, setClientLedgerData, setSelectedClientLedger } = ClientLedgerSlice.actions;
export default ClientLedgerSlice.reducer;
