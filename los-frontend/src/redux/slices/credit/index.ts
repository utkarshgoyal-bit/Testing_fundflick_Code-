import { IPersonalDetails } from '@/lib/interfaces';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  personalDetails: IPersonalDetails;
  propertyDetails: { [key: string]: string };
  familyDetails: { [key: string]: string };
  incomeDetails: { [key: string]: string }[];
  liabilityDetails: { [key: string]: string }[];
  error: unknown;
} = {
  personalDetails: {},
  propertyDetails: {},
  familyDetails: {},
  incomeDetails: [],
  liabilityDetails: [],
  error: null,
};

const creditSlice = createSlice({
  name: 'main/credit    ',
  initialState,
  reducers: {
    setPersonalDetails(state, action) {
      state.personalDetails = action.payload;
    },
    setPropertyDetails(state, action) {
      state.propertyDetails = action.payload;
    },
    setFamilyDetails(state, action) {
      state.familyDetails = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setIncomeDetails(state, action) {
      state.incomeDetails = action.payload;
    },
    setLiabilityDetails(state, action) {
      state.liabilityDetails = action.payload;
    },
  },
});

export const {
  setPersonalDetails,
  setPropertyDetails,
  setFamilyDetails,
  setError,
  setIncomeDetails,
  setLiabilityDetails,
} = creditSlice.actions;
export default creditSlice.reducer;
