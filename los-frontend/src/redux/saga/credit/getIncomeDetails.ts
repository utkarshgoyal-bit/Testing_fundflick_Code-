import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { GET_CREDIT_INCOME_DETAILS } from '@/redux/actions/types';
import { setError, setIncomeDetails } from '@/redux/slices/credit';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getIncomeDetails() {
  yield put(setLoading({ loading: true }));
  try {
    const fileId = urlQueryParams('id');
    const response: ApiResponse<any> = yield call(apiCaller, `/credit/income/${fileId}`, 'GET', {}, true, {
      pending: 'Adding Details...',
      success: 'Details edited successfully',
      error: 'An error occurred while updating details',
    });
    yield put(setIncomeDetails(response.data));
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* getCreditIncomeSaga() {
  yield takeEvery(GET_CREDIT_INCOME_DETAILS, getIncomeDetails);
}
