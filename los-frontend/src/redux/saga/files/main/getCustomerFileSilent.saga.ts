import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { FETCH_CUSTOMER_FILES_DATA_SILENT } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/files';
import { RootState } from '@/redux/store';
import { call, put, select, takeEvery } from 'redux-saga/effects';

function* getCustomerFileSilentSaga() {
  const filtersData: Record<string, string> = yield select((state: RootState) => state.customerFiles.filters);
  const queryParams = new URLSearchParams(filtersData).toString();

  try {
    const response: ApiResponse<any> = yield call(apiCaller, `/customer-file?${queryParams}`, 'GET', {}, false);
    if (response.data) {
      yield put(setData(response.data));
    }
  } catch (error) {
    console.error('Failed to fetch customer file:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  }
}

export default function* getCustomerFileSilent() {
  yield takeEvery(FETCH_CUSTOMER_FILES_DATA_SILENT, getCustomerFileSilentSaga);
}
