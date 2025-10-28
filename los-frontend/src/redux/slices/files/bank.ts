import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface bankDetails {
    loading: boolean;
    bank: any,
    error: any
}

const initialState: bankDetails = {
    loading: false,
    bank: {
        bank: [
            {
                bankName: "",
                bankBranchLocation: "",
                bankAccountType: "",
                bankAccountNumber: "",
                bankIFSCCode: "",
                city: "",
                state: "",
                district: "",
            }
        ],
    },
    error: null
};

const bankSlice = createSlice({
    name: 'file/bank',
    initialState,
    reducers: {
        setData(state, action: PayloadAction<{}>) {
            state.bank = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        resetBank() {
            return initialState;
        },

    },
});

export const { setData, setLoading, setError,resetBank } = bankSlice.actions;
export default bankSlice.reducer;
