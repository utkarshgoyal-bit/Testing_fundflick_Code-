import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IUserTable } from '@/lib/interfaces/tables';
import { call, put, takeEvery } from 'redux-saga/effects';
import { UNBLOCK_USERS_DATA, FETCH_USERS_DATA, FETCH_USERS_DATA_ERROR } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/users';
import { IRegisterUsersAction } from '@/lib/interfaces/';

function* unblockUsersDataSaga(action: IRegisterUsersAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ users: IUserTable[] }> = yield call(
      apiCaller,
      '/user/unblock',
      'PATCH',
      payload,
      true,
      {
        pending: 'Unblocking User...',
        success: 'User unblock successfully',
        error: 'An error occurred while unblocking user',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_USERS_DATA, payload: { silent: true, isBlocked: true } });
    }
    if (response.error) {
      yield put({ type: FETCH_USERS_DATA_ERROR, error: response.error });
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* watchUnblockUsers() {
  yield takeEvery(UNBLOCK_USERS_DATA, unblockUsersDataSaga);
}
