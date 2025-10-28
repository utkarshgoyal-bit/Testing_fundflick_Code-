import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface liabilityDetails {
    loading: boolean;
    liability: any,
    error: any,
    liabilityDialogAdd: boolean,
    liabilityDialogEdit: boolean
}

const initialState: liabilityDetails = {
    loading: false,
    liability: {},
    error: null,
    liabilityDialogAdd: false,
    liabilityDialogEdit: false
};

const liabilitySlice = createSlice({
    name: 'file/liability',
    initialState,
    reducers: {
        setData(state, action: PayloadAction<{}>) {
            state.liability = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        setLiabilityDialogAdd(state, action: PayloadAction<boolean>) {
            state.liabilityDialogAdd = action.payload;
        },
        setLiabilityDialogEdit(state, action: PayloadAction<boolean>) {
            state.liabilityDialogEdit = action.payload;
        },
        resetLiability() {
            return initialState;
        },

    },
});

export const { setData, setLoading, setError, setLiabilityDialogAdd, setLiabilityDialogEdit, resetLiability } = liabilitySlice.actions;
export default liabilitySlice.reducer;
