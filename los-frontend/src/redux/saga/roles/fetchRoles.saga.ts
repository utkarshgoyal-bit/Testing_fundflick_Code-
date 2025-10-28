import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IRolesTable } from '@/lib/interfaces/tables';
import { FETCH_ROLE_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError } from '@/redux/slices/roles';
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchRolesSaga() {
  yield put(setLoading({ loading: true, message: 'Fetching Roles' }));
  try {
    const response: ApiResponse<IRolesTable[]> = yield call(apiCaller, '/role');
    if (response.data) {
      yield put(setData(response.data));
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

export default function* fetchRoles() {
  yield takeEvery(FETCH_ROLE_DATA, fetchRolesSaga);
}
