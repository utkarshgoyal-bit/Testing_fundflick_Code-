import { ICollectionState } from '@/lib/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ICollectionState = {
  refCaseId: null,
  dueEmiAmount: 0,
  loading: false,
  error: null,
  tableConfiguration: {
    data: [],
    total: 0,
    page: 0,
    totalAmount: 0,
    filters: {},
  },
};

const PaymentCollectionSlice = createSlice({
  name: 'collection/payment',
  initialState,
  reducers: {
    fetchCaseRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchCaseSuccess: (state, action: PayloadAction<{ refCaseId: string; dueEmiAmount: number }>) => {
      state.refCaseId = action.payload.refCaseId;
      state.dueEmiAmount = action.payload.dueEmiAmount || 0;
      state.loading = false;
    },

    fetchCaseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    submitCaseRequest: (state) => {
      state.loading = true;
    },

    submitCaseSuccess: (state) => {
      state.loading = false;
    },

    submitCaseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setPromiseToPayTableData(state, action: PayloadAction<{ data: []; total: number; totalAmount: number }>) {
      state.tableConfiguration.data = action.payload.data;
      state.tableConfiguration.total = action.payload.total;
      state.tableConfiguration.totalAmount = action.payload.totalAmount;
    },
    setPage(state, action: PayloadAction<number>) {
      state.tableConfiguration.page = action.payload;
    },
    setFilter(state, action: PayloadAction<any>) {
      const filters = action.payload;

      Object.keys(filters).forEach((key) => {
        if (filters[key] === 'none' || filters[key] === '') {
          delete filters[key];
        }
      });
      state.tableConfiguration.filters = {
        ...filters,
      };
    },
    resetFilters(state) {
      state.tableConfiguration.filters = {};
    },
  },
});

export const {
  fetchCaseRequest,
  resetFilters,
  fetchCaseSuccess,
  fetchCaseFailure,
  submitCaseRequest,
  submitCaseSuccess,
  submitCaseFailure,
  setFilter,
  setPage,
  setPromiseToPayTableData,
} = PaymentCollectionSlice.actions;

export default PaymentCollectionSlice.reducer;
