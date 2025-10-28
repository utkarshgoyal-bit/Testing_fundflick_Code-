// In your salesMans slice
import { createSlice } from '@reduxjs/toolkit';
import { PENDENCY } from '@/redux/actions/types';
import { IPendencyTable } from '@/lib/interfaces/tables';

interface pendencyInitialState {
  data: IPendencyTable[];
  loading: boolean;
  unreadCount: number;
  error: any;
  commentLoading: boolean;
  activeTab: 'active' | 'history' | 'add';
  pendencyDialogOpen: {
    [key: string]: boolean;
  };
}
const initialState: pendencyInitialState = {
  data: [],
  loading: false,
  unreadCount: 0,
  error: null,
  commentLoading: false,
  activeTab: 'active',
  pendencyDialogOpen: {},
};
const PendencySlice = createSlice({
  name: PENDENCY,
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
      state.unreadCount = action.payload.filter((item: any) => !item.readStatus).length;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setCommentLoading(state, action) {
      state.commentLoading = action.payload;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setPendencyDialogOpen(state, action) {
      state.pendencyDialogOpen[action.payload.key] = action.payload.value;
    },
  },
});

export const { setData, setLoading, setError, setCommentLoading, setActiveTab, setPendencyDialogOpen } =
  PendencySlice.actions;
export default PendencySlice.reducer;
