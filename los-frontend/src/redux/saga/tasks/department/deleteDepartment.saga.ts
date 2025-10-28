import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { DepartmentAction } from '@/lib/interfaces';
import { IDepartmentTable } from '@/lib/interfaces/tables';
import { DELETE_DEPARTMENT, FETCH_DEPARTMENTS } from '@/redux/actions/types';
import { setError } from '@/redux/slices/department';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteDepartmentSaga(action: DepartmentAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ departments: IDepartmentTable[] }> = yield call(
      apiCaller,
      '/department',
      'DELETE',
      payload,
      true,
      {
        pending: 'Deleting Department...',
        success: 'Department deleted successfully',
        error: 'An error occurred while deleting department',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_DEPARTMENTS, payload: { silent: false } });
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

export default function* deleteDepartments() {
  yield takeEvery(DELETE_DEPARTMENT, deleteDepartmentSaga);
}
