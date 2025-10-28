import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface associatesDetails {
    loading: boolean;
    associates: any;
    addAssociateFormDialog: boolean
    editAssociateFormDialog: boolean
    error: string | null
}

const initialState: associatesDetails = {
    loading: false,
    error: '',
    associates: {},
    addAssociateFormDialog: false,
    editAssociateFormDialog: false
};

const associatesSlice = createSlice({
    name: 'file/associates',
    initialState,
    reducers: {
        setData(state, action: PayloadAction<{}>) {
            state.associates = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setAddAssociateFormDialog(state, action: PayloadAction<boolean>) {
            state.addAssociateFormDialog = action.payload;
        },
        setEditAssociateFormDialog(state, action: PayloadAction<boolean>) {
            state.editAssociateFormDialog = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        resetAssociates() {
            return initialState;
        },

    },
});

export const { setData, setLoading, setError, setEditAssociateFormDialog, setAddAssociateFormDialog,resetAssociates } = associatesSlice.actions;
export default associatesSlice.reducer;
