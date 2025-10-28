import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { RegisterRolesAction } from '@/lib/interfaces';
import { IRolesTable } from '@/lib/interfaces/tables';
import { FETCH_ROLE_DATA, REGISTER_ROLE_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError, setRoleFormOpen } from '@/redux/slices/roles';
import { call, put, takeEvery } from 'redux-saga/effects';

function* registerNewRolesSaga(action: RegisterRolesAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ data: IRolesTable[] }> = yield call(apiCaller, '/role', 'POST', payload, true, {
      pending: 'Creating role...',
      success: 'Role created successfully',
      error: 'An error occurred while creating role',
    });

    if (response.data) {
      yield put({ type: FETCH_ROLE_DATA });
      yield put(setRoleFormOpen(false));
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

export default function* registerNewRole() {
  yield takeEvery(REGISTER_ROLE_DATA, registerNewRolesSaga);
}
