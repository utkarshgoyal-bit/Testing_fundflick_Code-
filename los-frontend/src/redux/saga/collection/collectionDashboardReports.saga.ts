import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { COLLECTION_DASHBOARD_REPORT } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/collection/collectionDashboardReports';
import { setLoading } from '@/redux/slices/publicSlice';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* collectionDashboardReportSaga() {
  yield put(setLoading({ loading: true, message: 'Fetching Collections reports' }));
  try {
    const response: ApiResponse<any> = yield call(apiCaller, `/collection/reports`, 'GET');
    if (response instanceof AxiosError) {
      throw response;
    }
    if (response.data) {
      yield put(setData(response.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      yield navigator.vibrate([200, 100, 200]);
      yield put(
        setError(
          error?.response?.data.result?.message || error?.response?.data.errorMessage || ERROR_MESSAGE.UNEXPECTED
        )
      );
    } else {
      yield put(setError(error?.toString() || ERROR_MESSAGE.UNEXPECTED));
    }
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchCollectionDashboardReportsSaga() {
  yield takeEvery(COLLECTION_DASHBOARD_REPORT, collectionDashboardReportSaga);
}
