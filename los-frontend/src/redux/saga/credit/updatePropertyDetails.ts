import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { UPDATE_CREDIT_PROPERTY_DETAILS } from '@/redux/actions/types';
import { setError, setPropertyDetails } from '@/redux/slices/credit';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updatePropertyDetails(action: { type: string; payload: any }) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const fileId = urlQueryParams('id');
    const response: ApiResponse<any> = yield call(
      apiCaller,
      `/credit/property?fileId=${fileId}`,
      'POST',
      payload,
      true,
      {
        pending: 'Updating Details...',
        success: 'Details updated successfully',
        error: 'An error occurred while updating details',
      }
    );
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

export default function* updatePropertyDetailsSaga() {
  yield takeEvery(UPDATE_CREDIT_PROPERTY_DETAILS, updatePropertyDetails);
}
