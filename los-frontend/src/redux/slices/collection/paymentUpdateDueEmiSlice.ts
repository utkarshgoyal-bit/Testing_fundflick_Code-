import { IPayment } from '@/lib/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'; // Import the Payment interface

interface CollectionState {
  payments: IPayment[] | null;
  error: string | null;
}

const initialState: CollectionState = {
  payments: null,
  error: null,
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setPayments(state, action: PayloadAction<IPayment[]>) {
      state.payments = action.payload;
      state.error = null;
    },
    setPaymentsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.payments = null;
    },
  },
});

export const { setPayments, setPaymentsError } = collectionSlice.actions;
export default collectionSlice.reducer;
