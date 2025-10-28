import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { FETCH_LOAN_BY_ID } from '@/redux/actions/types';
import apiCaller from '@/helpers/apiHelper';
import { FetchLoanByIdApiResponse } from '@/lib/interfaces';
import { setLoanById, setLoanByIdError, setLoanByIdLoading } from '@/redux/slices/loanManagement/fetchLoanById';
import { setLoading } from '@/redux/slices/publicSlice';

function* fetchLoanByIdSaga(action: PayloadAction<{ loanId: number }>): Generator<any, void, any> {
  try {
    yield put(setLoanByIdLoading(true));
    yield put(setLoading({ loading: true, message: 'Fetching Loan...' }));
    const response: FetchLoanByIdApiResponse = yield call(apiCaller, `/loans/${action.payload.loanId}`, 'GET');
    const { success, message, data } = response.data;
    if (success) {
      yield put(setLoanByIdLoading(false));
      yield put(setLoading({ loading: false }));
      yield put(setLoanById({ data: data, message: message }));
    } else {
      yield put(setLoanByIdLoading(false));
      yield put(setLoading({ loading: false }));
      yield put(setLoanByIdError(message || 'Error in fetching loan'));
    }
  } catch (error: any) {
    yield put(setLoanByIdLoading(false));
    yield put(setLoading({ loading: false }));
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch loan details';
    yield put(setLoanByIdError(errorMessage));
  }
}
export default function* watchFetchLoanById(): Generator<any, void, any> {
  yield takeEvery(FETCH_LOAN_BY_ID, fetchLoanByIdSaga);
}
