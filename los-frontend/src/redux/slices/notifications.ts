// In your salesMans slice
import { createSlice } from "@reduxjs/toolkit";
import { NOTIFICATION } from "@/redux/actions/types";
interface notificationInitialState {
  data: {
    _id: string;
    file: string;
    title: string;
    message: string;
    createdAt: string;
    readStatus: boolean;
    loanApplicationNumber: number;
  }[];
  loading: boolean;
  unreadCount: number;
}
const initialState: notificationInitialState = {
  data: [],
  loading: false,
  unreadCount: 0,
};
const NotificationSlice = createSlice({
  name: NOTIFICATION,
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
      state.unreadCount = action.payload.filter((item: any) => !item.readStatus).length;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    readMessage(state, action) {
      state.data = state.data.map((item: any) => {
        if (item._id === action.payload) {
          return { ...item, readStatus: true };
        }
        return item;
      });
    },
    addNewNotification(state, action) {
      state.data = [action.payload, ...state.data];
      state.unreadCount = state.unreadCount + 1;
    },
  },
});

export const { setData, setLoading, addNewNotification, readMessage } = NotificationSlice.actions;
export default NotificationSlice.reducer;
