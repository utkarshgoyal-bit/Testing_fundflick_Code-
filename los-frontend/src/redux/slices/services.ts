import { IServiceTable } from '@/lib/interfaces';
import { createSlice } from '@reduxjs/toolkit';
import { SERVICE } from '../actions/types';
interface servicesInitialState {
  data: IServiceTable[];
  selectedService?: Omit<IServiceTable, 'departmentId'> & { departmentId: string };
  loading: boolean;
  error: any;
  total: number;
  activePage: number;
}
const initialState: servicesInitialState = {
  data: [],
  total: 0,
  activePage: 1,
  loading: false,
  error: null,
};
const ServiceSlice = createSlice({
  name: SERVICE,
  initialState,
  reducers: {
    setSelectedService(state, action) {
      state.selectedService = action.payload;
    },
    setTotalServices(state, action) {
      state.total = action.payload;
    },
    setServiceActivePage(state, action) {
      state.activePage = action.payload;
    },

    setData(state, action) {
      state.data = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setData, setTotalServices, setSelectedService, setServiceActivePage, setLoading, setError } =
  ServiceSlice.actions;
export default ServiceSlice.reducer;
