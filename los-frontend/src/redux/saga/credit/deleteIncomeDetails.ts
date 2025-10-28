import apiCaller from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { DELETE_CREDIT_INCOME_DETAILS, GET_CREDIT_INCOME_DETAILS } from '@/redux/actions/types';
import { setError } from '@/redux/slices/credit';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteIncomeDetails(action: { type: string; payload: any }) {
  yield put(setLoading({ loading: true }));
  try {
    const fileId = urlQueryParams('id');
    yield call(apiCaller, `/credit/income/${fileId}?id=${action.payload}`, 'DELETE', {}, true, {
      pending: 'Adding Details...',
      success: 'Details deleted successfully',
      error: 'An error occurred while updating details',
    });
    yield put({ type: GET_CREDIT_INCOME_DETAILS });
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* deleteCreditIncomeSaga() {
  yield takeEvery(DELETE_CREDIT_INCOME_DETAILS, deleteIncomeDetails);
}
