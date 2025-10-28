import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IRegisterUsersAction, IUserTable } from '@/lib/interfaces';
import { call, put, takeEvery } from 'redux-saga/effects';
import { setData, setError } from '@/redux/slices/users';
import { setLoading } from '@/redux/slices/publicSlice';
import { ROUTES } from '@/lib/enums';
import { REGISTER_USERS_DATA } from '@/redux/actions/types';
import { buildOrgRoute } from '@/helpers/routeHelper';
function* registerUsers(action: IRegisterUsersAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ users: IUserTable[] }> = yield call(apiCaller, '/user', 'POST', payload, true, {
      pending: 'Creating New Users...',
      success: 'User created successfully',
      error: 'An error occurred while creating user',
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
export default function* watchRegisterUsers() {
  yield takeEvery(REGISTER_USERS_DATA, registerUsers);
}
