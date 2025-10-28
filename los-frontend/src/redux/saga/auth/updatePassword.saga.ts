/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { ILoginApiResponse } from '@/lib/interfaces/apisResponse.interface';
import { UPDATE_PASSWORD } from '@/redux/actions/types';
import { setError, setLoading } from '@/redux/slices/login';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updatePasswordSaga(action: any) {
  yield put(setLoading({ loading: true }));
  try {
    const response: ApiResponse<ILoginApiResponse> = yield call(
      apiCaller,
      '/auth/forgot-password',
      'POST',
      action.payload,
      true,
      {
        pending: 'Processing data...',
        success: 'Successfully',
        error: 'Failed to save data',
      }
    );
    if (response instanceof AxiosError) {
      throw response;
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

export default function* updatePassword() {
  yield takeEvery(UPDATE_PASSWORD, updatePasswordSaga);
}
