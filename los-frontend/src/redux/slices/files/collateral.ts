import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface collateralDetails {
    loading: boolean;
    collateral: any,
    error: any
}

const initialState: collateralDetails = {
    loading: false,
    collateral: {},
    error: null
};

const collateralSlice = createSlice({
    name: 'file/collateral',
    initialState,
    reducers: {
        setData(state, action: PayloadAction<{}>) {
            state.collateral = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        resetCollateral() {
            return initialState;
        },

    },
});

export const { setData, setLoading, setError,resetCollateral } = collateralSlice.actions;
export default collateralSlice.reducer;
