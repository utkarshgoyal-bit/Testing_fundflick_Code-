import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { FETCH_LOAN_STATISTICS } from '@/redux/actions/types';
import apiCaller from '@/helpers/apiHelper';
import { FetchLoansApiResponse } from '@/lib/interfaces';
import {
  setAllLoansStatistics,
  setAllLoansStatisticsError,
  setFilesStatisticsLoading,
} from '@/redux/slices/loanManagement/fetchLoanStatistics';
import { setLoading } from '@/redux/slices/publicSlice';

function* fetchLoanStatistics(action?: PayloadAction<any>): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true, message: 'Fetching Loan Statistics...' }));
    yield put(setFilesStatisticsLoading(true));
    const response: FetchLoansApiResponse = yield call(
      apiCaller,
      `/loans/reports/statistics`,
      'GET',
      action?.payload || {}
    );
    const { data: allFiles, success, message } = response.data;

    if (success) {
      yield put(setAllLoansStatistics({ data: allFiles, total: allFiles?.length || 0, loading: false, error: null }));
    } else {
      yield put(setFilesStatisticsLoading(false));
      yield put(setAllLoansStatisticsError(message || 'Failed to fetch loans'));
    }
  } catch (error: any) {
    yield put(setFilesStatisticsLoading(false));
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch loans';
    yield put(setAllLoansStatisticsError(errorMessage));
  } finally {
    yield put(setLoading({ loading: false }));
    yield put(setFilesStatisticsLoading(false));
  }
}
export default function* watchAllLoansStatistics(): Generator<any, void, any> {
  yield takeEvery(FETCH_LOAN_STATISTICS, fetchLoanStatistics);
}
