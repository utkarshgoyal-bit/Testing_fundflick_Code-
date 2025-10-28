import { LOAN_TYPE, STEPS_NAMES } from '@/lib/enums';
import { ICustomerFileTable, CustomerFilesState } from '@/lib/interfaces/';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CustomerFilesState = {
  loading: false,
  filters: {},
  formLoading: false,
  PhotoGroupDialogAdd: {},
  associateDialogAdd: false,
  associateDialogEdit: false,
  liabilityDialogAdd: false,
  liabilityDialogEdit: false,
  selectedFile: {},
  backOfficeAssociateDialog: false,
  error: null,
  activeStep: STEPS_NAMES.CUSTOMER,
  stepsData: {},
  tableConfiguration: {
    data: [],
    total: 0,
    tableView: {},
    page: 0,
    sort: [],
  },
  completedSteps: [],
  existingLoans: [
    {
      loanCategory: LOAN_TYPE.EXISTING_LOAN,
      loanType: '',
      loanAmount: 0,
      emi: 0,
      irr: 0,
      lenderName: '',
      noOfEmiPaid: 0,
      tenure: 0,
      noOfemiLeft: 0,
      paymentsMade: '',
      foreclosure: '',
      photo: '',
      comments: '',
    },
  ],
  stepsDone: [],
};

const customerFilesSlice = createSlice({
  name: 'file/customer-files',
  initialState,
  reducers: {
    updateReadStatus: (state, action: PayloadAction<any>) => {
      const index = state.tableConfiguration.data.findIndex(
        (item: any) => item.loanApplicationNumber === action.payload.fileId
      );
      state.tableConfiguration.data[index].fileCommentsReadStatus = true;
    },
    setFiltersData: (state, action: PayloadAction<any>) => {
      state.filters = action.payload;
    },
    deleteFiltersData: (state, action: PayloadAction<any>) => {
      if (state.filters) {
        delete state.filters[action.payload];
      }
    },
    resetStepperForm: (state) => {
      state.stepsData = initialState.stepsData;
      state.activeStep = STEPS_NAMES.CUSTOMER;
    },
    setData(state, action: PayloadAction<ICustomerFileTable[]>) {
      state.tableConfiguration.data = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    formLoading(state, action: PayloadAction<boolean>) {
      state.formLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setTableFilters(state, action: PayloadAction<any>) {
      state.tableConfiguration = action.payload;
    },
    setActiveStep(state, action: PayloadAction<string>) {
      state.activeStep = action.payload;
    },
    setStepsData(state, action: PayloadAction<any>) {
      state.stepsData = { ...state.stepsData, ...action.payload };
    },
    setCompletedSteps(state, action: PayloadAction<string>) {
      state.completedSteps.push(action.payload);
    },
    setCustomCompletedSteps: (state, action: PayloadAction<string>) => {
      state.completedSteps.push(action.payload);
    },
    setBankDetails: (state, action: PayloadAction<{ index: number; data: any }>) => {
      state.stepsData.bank[action.payload.index] = {
        ...state.stepsData.bank[action.payload.index],
        ...action.payload.data,
      };
    },
    setAssociateDialogAdd: (state, action: PayloadAction<boolean>) => {
      state.associateDialogAdd = action.payload;
    },
    setAssociateDialogEdit: (state, action: PayloadAction<boolean>) => {
      state.associateDialogEdit = action.payload;
    },
    setLiabilityDialogAdd: (state, action: PayloadAction<boolean>) => {
      state.liabilityDialogAdd = action.payload;
    },
    setLiabilityDialogEdit: (state, action: PayloadAction<boolean>) => {
      state.liabilityDialogEdit = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<any>) => {
      state.selectedFile = action.payload;
    },
    setBackOfficeAssociateDialog(state, action: PayloadAction<boolean>) {
      state.backOfficeAssociateDialog = action.payload;
    },
  },
});

export const {
  setData,
  setLoading,
  setBackOfficeAssociateDialog,
  setSelectedFile,
  updateReadStatus,
  formLoading,
  deleteFiltersData,
  setFiltersData,
  setAssociateDialogAdd,
  setAssociateDialogEdit,
  setLiabilityDialogAdd,
  setLiabilityDialogEdit,
  setError,
  resetStepperForm,
  setBankDetails,
  setTableFilters,
  setActiveStep,
  setStepsData,
  setCompletedSteps,
  setCustomCompletedSteps,
} = customerFilesSlice.actions;
export default customerFilesSlice.reducer;
