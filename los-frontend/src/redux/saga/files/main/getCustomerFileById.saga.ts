import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE } from '@/lib/enums';
import { FETCH_CUSTOMER_FILES_BY_ID_DATA } from '@/redux/actions/types';
import { setError, setSelectedFile } from '@/redux/slices/files';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getCustomerFileByIdSaga() {
  yield put(setLoading({ loading: true }));
  const id = urlQueryParams('id');
  try {
    const response: ApiResponse<any> = yield call(apiCaller, `/customer-file/${id}`, 'GET', {}, false);
    if (response.data) {
      yield put(setSelectedFile(response.data));
    }
  } catch (error) {
    console.error('Failed to fetch customer file:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* getCustomerFileById() {
  yield takeEvery(FETCH_CUSTOMER_FILES_BY_ID_DATA, getCustomerFileByIdSaga);
}
