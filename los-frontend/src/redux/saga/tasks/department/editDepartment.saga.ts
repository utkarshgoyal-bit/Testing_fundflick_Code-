import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { DepartmentAction } from '@/lib/interfaces';
import { IDepartmentTable } from '@/lib/interfaces/tables';
import { EDIT_DEPARTMENT, FETCH_DEPARTMENTS } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/department';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editDepartmentSaga(action: DepartmentAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ departments: IDepartmentTable[] }> = yield call(
      apiCaller,
      '/department',
      'PUT',
      payload,
      true,
      {
        pending: 'Updating Department...',
        success: 'Department updated successfully',
        error: 'An error occurred while updating department',
      }
    );
    if (response.data) {
      yield put(setData(response.data.departments));
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

export default function* editDepartment() {
  yield takeEvery(EDIT_DEPARTMENT, editDepartmentSaga);
}
