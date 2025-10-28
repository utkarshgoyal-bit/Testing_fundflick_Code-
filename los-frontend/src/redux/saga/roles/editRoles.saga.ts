import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IRolesTable } from '@/lib/interfaces/tables';
import { EDIT_ROLE_DATA, FETCH_ROLE_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError, setRoleFormOpen } from '@/redux/slices/roles';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editRoleSaga(action: {
  type: string;
  payload: {
    id: number;
    data: {
      name: string;
    };
  };
}) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ data: IRolesTable[] }> = yield call(
      apiCaller,
      `/role/${payload.id}`,
      'PUT',
      payload.data,
      true,
      {
        pending: 'Updating role...',
        success: 'Role updated successfully',
        error: 'An error occurred while updating role',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_ROLE_DATA });
      yield put(setRoleFormOpen(false));
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

export default function* editRole() {
  yield takeEvery(EDIT_ROLE_DATA, editRoleSaga);
}
