import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { GET_CREDIT_PROPERTY_DETAILS } from '@/redux/actions/types';
import { setError, setPropertyDetails } from '@/redux/slices/credit';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getPropertyDetails() {
  yield put(setLoading({ loading: true }));
  try {
    const fileId = urlQueryParams('id');
    const response: ApiResponse<any> = yield call(apiCaller, '/credit/property?fileId=' + fileId, 'GET', {}, true, {
      pending: 'Updating Details...',
      success: 'Details get successfully',
      error: 'An error occurred while updating details',
    });
    if (response.data) {
      yield put(setPropertyDetails(response.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* getPropertyDetailsSaga() {
  yield takeEvery(GET_CREDIT_PROPERTY_DETAILS, getPropertyDetails);
}
