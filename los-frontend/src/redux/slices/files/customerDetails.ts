import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomerDetails {
    loading: boolean;
    customerDetails: any,
    error: any
}

const initialState: CustomerDetails = {
    loading: false,
    customerDetails: {},
    error: null,
};

const customerDetailsSlice = createSlice({
    name: 'file/customerDetails',
    initialState,
    reducers: {
        setData(state, action: PayloadAction<{}>) {
            state.customerDetails = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        resetCustomerDetails() {
            return initialState;
        },

    },
});

export const { setData, setLoading, setError, resetCustomerDetails } = customerDetailsSlice.actions;
export default customerDetailsSlice.reducer;
