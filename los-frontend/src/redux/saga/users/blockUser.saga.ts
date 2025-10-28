import { BLOCK_USERS_DATA, FETCH_USERS_DATA } from '@/redux/actions/types';
import { call, put, takeEvery } from 'redux-saga/effects';
import { IRegisterUsersAction } from '@/lib/interfaces/';
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { setLoading } from '@/redux/slices/publicSlice';
import { IUserTable } from '@/lib/interfaces/tables';
import { setError } from '@/redux/slices/users';
function* blockUsersDataSaga(action: IRegisterUsersAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ users: IUserTable[] }> = yield call(
      apiCaller,
      '/user/block',
      'DELETE',
      payload,
      true,
      {
        pending: 'Blocking User...',
        success: 'User block successfully',
        error: 'An error occurred while blocking user',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_USERS_DATA, payload: { silent: true, isBlocked: false } });
    }
    if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* watchBlockUsers() {
  yield takeEvery(BLOCK_USERS_DATA, blockUsersDataSaga);
}
