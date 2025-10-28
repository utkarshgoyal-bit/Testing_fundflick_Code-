import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { CREATE_LOAN, FETCH_LOANS } from '@/redux/actions/types';
import apiCaller from '@/helpers/apiHelper';
import { CreateLoanApiResponse, CreateLoanPayload } from '@/lib/interfaces';
import {
  setCreateLoanData,
  setCreateLoanLoading,
  setCreateLoanError,
} from '@/redux/slices/loanManagement/createNewLoan';
import { setLoading } from '@/redux/slices/publicSlice';

function* createLoanSaga(action: PayloadAction<CreateLoanPayload>): Generator<any, void, any> {
  try {
    yield put(setCreateLoanLoading(false));
    yield put(setLoading({ loading: true, message: 'Creating Loan' }));
    const response: CreateLoanApiResponse = yield call(apiCaller, `/loans`, 'POST', action.payload);
    const { success, message, data = [] } = response.data;

    if (success) {
      yield put(
        setCreateLoanData({ data: data, loading: false, total: Array.isArray(data) ? data.length : 1, error: null })
      );
      yield put({ type: FETCH_LOANS });
    } else {
      yield put(setCreateLoanLoading(false));
      yield put(setLoading({ loading: false }));
      const errorMessage = message || 'Failed to create loan';
      yield put(setCreateLoanError(errorMessage));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create loan';
    yield put(setCreateLoanLoading(false));
    yield put(setLoading({ loading: false }));
    yield put(setCreateLoanError(errorMessage));
  }
}

export default function* watchCreateLoanSaga(): Generator<any, void, any> {
  yield takeEvery(CREATE_LOAN, createLoanSaga);
}
