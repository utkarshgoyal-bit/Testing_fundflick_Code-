import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { FETCH_LOANS, FETCH_LOAN_STATISTICS } from '@/redux/actions/types';
import apiCaller from '@/helpers/apiHelper';
import { FetchLoansApiResponse } from '@/lib/interfaces';
import { setAllLoans, setAllLoansError, setLoanFilesLoading } from '@/redux/slices/loanManagement/fetchAllLoans';
import { setLoading } from '@/redux/slices/publicSlice';

function* fetchLoansSaga(action?: PayloadAction<any>): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true, message: 'Fetching all loans...' }));
    yield put(setLoanFilesLoading(true));
    const response: FetchLoansApiResponse = yield call(apiCaller, `/loans`, 'GET', action?.payload || {});
    const { data: allFiles, success, message } = response.data;

    if (success) {
      yield put(setAllLoans({ data: allFiles, total: allFiles?.length || 0, loading: false, error: null }));
      yield put({ type: FETCH_LOAN_STATISTICS });
    } else {
      yield put(setLoanFilesLoading(false));
      yield put(setAllLoansError(message || 'Failed to fetch loans'));
    }
  } catch (error: any) {
    yield put(setLoanFilesLoading(false));
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch loans';
    yield put(setAllLoansError(errorMessage));
  }
}
export default function* watchFetchLoans(): Generator<any, void, any> {
  yield takeEvery(FETCH_LOANS, fetchLoansSaga);
}
