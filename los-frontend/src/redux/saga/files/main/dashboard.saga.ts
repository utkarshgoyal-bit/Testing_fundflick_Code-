import { ERROR_MESSAGE } from '@/lib/enums';
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import { DASHBOARD } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/dashboard';
import { setLoading } from '@/redux/slices/publicSlice';

function* dashboardSaga() {
  yield put(setLoading({ loading: true }));
  try {
    const response: ApiResponse<any> = yield call(apiCaller, '/dashboard', 'GET');
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
      // Vibration pattern for incorrect dashboard
      yield navigator.vibrate([200, 100, 200]);
      yield put(
        setError(
          error?.response?.data.result?.message || error?.response?.data.errorMessage || ERROR_MESSAGE.UNEXPECTED
        )
      );
    } else {
      // Handle unexpected errors
      yield put(setError(error?.toString() || ERROR_MESSAGE.UNEXPECTED));
    }
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

// Watcher saga to listen for dashboard actions
export default function* Dashboard() {
  yield takeEvery(DASHBOARD, dashboardSaga);
}
