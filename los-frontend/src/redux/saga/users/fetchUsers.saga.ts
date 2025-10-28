/* eslint-disable @typescript-eslint/no-explicit-any */
import { setData, setError } from '@/redux/slices/users';
import { call, put, takeEvery } from 'redux-saga/effects';
import { setLoading } from '@/redux/slices/publicSlice';
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IUserTable } from '@/lib/interfaces/tables';
import { FETCH_USERS_DATA, FETCH_CLIENTS } from '@/redux/actions/types';
function* fetchUsersDataSaga(action: {
  type: string;
  payload: { silent?: boolean; isBlocked?: boolean; branchName?: string; isOther?: boolean; isAllowSelfUser?: Boolean, isFetchClients?: boolean };
}) {
  try {
    let query = '';
    if (action.payload.isBlocked !== undefined) {
      query += `?isBlocked=${action.payload.isBlocked}`;
    }
    if (action.payload.branchName) {
      query += (query ? '&' : '?') + `branchName=${action.payload.branchName}`;
    }
    if (action.payload.isOther) {
      query += (query ? '&' : '?') + `other=${action.payload.isOther}`;
    }
    if (action.payload.isAllowSelfUser) {
      query += (query ? '&' : '?') + `isAllowSelfUser=${action.payload.isAllowSelfUser}`;
    }
    if (action.payload.isFetchClients) {
      yield put({ type: FETCH_CLIENTS })
    }
    const response: ApiResponse<IUserTable[]> = yield call(apiCaller, '/user', 'GET', +query);
    if (response.data) {
      yield put(setData(response.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error: any) {
    console.error('Fetch data failed', error);
    yield put(setError(error.message || 'Fetch data failed'));
  } finally {
    if (!action.payload.silent) {
      yield put(setLoading({ loading: false }));
    }
  }
}

export default function* fetchUserData() {
  yield takeEvery(FETCH_USERS_DATA, fetchUsersDataSaga);
}
