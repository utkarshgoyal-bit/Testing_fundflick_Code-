import { ITelephoneTable } from '@/lib/interfaces/tables';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TelephoneQuestionsState {
  loading: boolean;
  error: string | null;
  SelectedQuestion: ITelephoneTable | null;
  tableConfiguration: {
    data: ITelephoneTable[] | [];
    total: number;
    tableView: any;
    page: number;
    sort: any[];
  }
}

const initialState: TelephoneQuestionsState = {
  loading: false,
  error: null,
  SelectedQuestion: null,
  tableConfiguration: {
    data: [],
    total: 0,
    tableView: {},
    page: 0,
    sort: [],

  }
};

const questionsSlice = createSlice({
  name: 'main/questions-slice',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<ITelephoneTable[]>) {
      state.tableConfiguration.data = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setTableFilters(state, action: PayloadAction<any>) {
      state.tableConfiguration = action.payload;
    },
    setSelectedQuestion(state, action: PayloadAction<ITelephoneTable | null>) {
      state.SelectedQuestion = action.payload
    }
  },
});

export const { setData, setLoading, setError, setTableFilters, setSelectedQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;
