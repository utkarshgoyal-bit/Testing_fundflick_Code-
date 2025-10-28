/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { ILoginApiResponse } from '@/lib/interfaces/apisResponse.interface';
import { LOGIN } from '@/redux/actions/types';
import { setError, setIsAuthenticated, setLoading, setOrganizations, setToken } from '@/redux/slices/login';
import { setLocalStorage } from '@/utils';
import { AxiosError } from 'axios';
import Debug from 'debug';
import { call, put, takeEvery } from 'redux-saga/effects';
const debug = Debug('ta:commerce-sdk:thunk:fetchBugs');
function* loginSaga(action: any) {
  debug('loginSaga called', action);
  yield put(setLoading(true));
  try {
    const response: ApiResponse<ILoginApiResponse> = yield call(apiCaller, '/auth/login', 'POST', {
      ...(action.payload && action.payload),
    });
    if (response instanceof AxiosError) {
      throw response;
    }
    if (response.data) {
      yield put(setIsAuthenticated(true));
      yield put(setOrganizations(response.data.organizations));
      const token = response.data.token;
      yield setLocalStorage('token', token);
      yield setLocalStorage('data', JSON.stringify(response.data));
      yield put(setToken(token));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      // Vibration pattern for incorrect login
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
    yield put(setLoading(false));
  }
}

export default function* login() {
  yield takeEvery(LOGIN, loginSaga);
}
