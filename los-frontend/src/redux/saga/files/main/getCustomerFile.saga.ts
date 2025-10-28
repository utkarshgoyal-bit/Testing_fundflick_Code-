import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { FETCH_CUSTOMER_FILES_DATA } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/files';
import { setLoading } from '@/redux/slices/publicSlice';
import { RootState } from '@/redux/store';
import { call, put, select, takeEvery } from 'redux-saga/effects';

function* getCustomerFileSaga() {
  yield put(setLoading({ loading: true }));
  const filtersData: Record<string, string> = yield select((state: RootState) => state.customerFiles.filters);
  const queryParams = new URLSearchParams(filtersData).toString();

  try {
    const response: ApiResponse<any> = yield call(apiCaller, `/customer-file?${queryParams}`, 'GET', {}, false);
    if (response.data) {
      yield put(setData(response.data));
    }
  } catch (error) {
    console.error('Failed to fetch customer file:', error);
    const _error = JSON.stringify(error);
    yield put(setError(_error || ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* getCustomerFile() {
  yield takeEvery(FETCH_CUSTOMER_FILES_DATA, getCustomerFileSaga);
}
