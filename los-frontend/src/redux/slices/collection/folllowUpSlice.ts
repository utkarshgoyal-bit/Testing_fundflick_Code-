import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPaymentState, IFollowUpPayment } from '@/lib/interfaces';

const initialState: IPaymentState = {
  payments: null,
  error: null,
  loading: false,
  tableConfiguration: {
    data: [],
    total: 0,
    page: 0,
    filters: {
      type: 'date',
    },
  },
};

const collectionSlice = createSlice({
  name: 'collection/followUp',
  initialState,
  reducers: {
    fetchPaymentsStart(state, action: PayloadAction<IFollowUpPayment[]>) {
      state.payments = action.payload;
      state.error = null;
    },

    fetchPaymentsSuccess(state, action: PayloadAction<IFollowUpPayment[]>) {
      state.loading = false;
      state.payments = action.payload;
    },

    fetchPaymentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.payments = null;
    },

    setFollowUpTableData(state, action: PayloadAction<{ data: []; total: number }>) {
      state.tableConfiguration.data = action.payload.data;
      state.tableConfiguration.total = action.payload.total;
    },
    setPage(state, action: PayloadAction<number>) {
      state.tableConfiguration.page = action.payload;
    },
    setFilter(state, action: PayloadAction<any>) {
      const filters = action.payload;
      Object.keys(filters).forEach((key) => {
        if (filters[key] === 'none') {
          delete filters[key];
        }
      });

      state.tableConfiguration.filters = {
        ...state.tableConfiguration.filters,
        ...filters,
      };
    },
    resetFilters(state) {
      state.tableConfiguration.filters = {
        type: 'date',
      };
    },
  },
});

export const {
  fetchPaymentsStart,
  fetchPaymentsSuccess,
  fetchPaymentsFailure,
  setFollowUpTableData,
  setPage,
  setFilter,
  resetFilters,
} = collectionSlice.actions;

export default collectionSlice.reducer;
