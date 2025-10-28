import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CollectionState {
  file: File | null;
  error: string;
  loading: boolean;
}

const initialState: CollectionState = {
  file: null,
  error: "",
  loading: false,
};

const collectionSlice = createSlice({
  name: "collection/file",
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<File | null>) => {
      state.file = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setFile, setError, setLoading } = collectionSlice.actions;
export default collectionSlice.reducer;

