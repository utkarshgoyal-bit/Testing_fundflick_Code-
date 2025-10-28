import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IRolesTable } from '@/lib/interfaces/tables';
import { DELETE_ROLE_DATA, FETCH_ROLE_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError, setRoleFormOpen } from '@/redux/slices/roles';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteRolesSaga(action: {
  type: string;
  payload: {
    id: number;
  };
}) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ data: IRolesTable[] }> = yield call(
      apiCaller,
      `/role/${action.payload.id}`,
      'DELETE',
      payload,
      true,
      {
        pending: 'Deleting role...',
        success: 'Role deleted successfully',
        error: 'An error occurred while deleting role',
      }
    );

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

export default function* deleteRole() {
  yield takeEvery(DELETE_ROLE_DATA, deleteRolesSaga);
}
