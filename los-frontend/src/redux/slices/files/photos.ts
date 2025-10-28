import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface photosDetails {
    loading: boolean;
    photos: any,
    error: any,
    photosAddFormDialog: {
        [key: string]: boolean
    }
}

const initialState: photosDetails = {
    loading: false,
    photos: {},
    error: null,
    photosAddFormDialog: {}
};

const photosSlice = createSlice({
    name: 'file/photos',
    initialState,
    reducers: {
        setData(state, action: PayloadAction<{}>) {
            state.photos = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        setPhotosAddFormDialog(state, action: PayloadAction<any>) {
            state.photosAddFormDialog = { ...state.photosAddFormDialog, ...action.payload }
        },
        resetPhotos() {
            return initialState;
        },
    },
});

export const { setData, setLoading, setError, setPhotosAddFormDialog, resetPhotos } = photosSlice.actions;
export default photosSlice.reducer;
