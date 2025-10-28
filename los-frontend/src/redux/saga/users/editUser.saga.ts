import { ROUTES } from '@/lib/enums';
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IUserTable } from '@/lib/interfaces/tables';
import { call, put, takeEvery } from 'redux-saga/effects';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError } from '@/redux/slices/users';
import { IRegisterUsersAction } from '@/lib/interfaces/';
import { EDIT_USERS_DATA } from '@/redux/actions/types';
import { buildOrgRoute } from '@/helpers/routeHelper';

function* editUsersData(action: IRegisterUsersAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ users: IUserTable[] }> = yield call(apiCaller, '/user', 'PUT', payload, true, {
      pending: 'Updating User...',
      success: 'User updated successfully',
      error: 'An error occurred while updating user',
    });
    if (response.data) {
      yield put(setData(response.data.users));
      navigation(buildOrgRoute(ROUTES.USER_MANAGEMENT));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* watchEditUsers() {
  yield takeEvery(EDIT_USERS_DATA, editUsersData);
}
