import { IAddressDetails } from '@/lib/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IAddressDetails = {
  loading: false,
  addressData: {
    address: [
      {
        pltNo: '',
        addressLine: '',
        addressLineTwo: '',
        city: '',
        state: '',
        country: 'India',
        pinCode: '',
        gpsCoordinates: '',
      },
    ],
  },
  error: null,
};

const addressSlice = createSlice({
  name: 'file/address',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<{ [key: string]: any }>) {
      if (action.payload.address.length) {
        state.addressData = action.payload;
      } else {
        state.addressData = {
          ...action.payload,
          address: initialState.addressData.address,
        };
      }
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    resetAddress() {
      return initialState;
    },
  },
});

export const { setData, setLoading, setError, resetAddress } = addressSlice.actions;
export default addressSlice.reducer;
