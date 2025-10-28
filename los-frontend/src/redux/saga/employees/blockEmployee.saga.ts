import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { EmployeesAction } from '@/lib/interfaces/employee.interface';
import { IEmployeeTable } from '@/lib/interfaces/tables';
import { BLOCK_EMPLOYEES_DATA, FETCH_EMPLOYEES_DATA } from '@/redux/actions/types';
import { setError } from '@/redux/slices/employees';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';
function* blockEmployeeSaga(action: EmployeesAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ employees: IEmployeeTable[] }> = yield call(
      apiCaller,
      '/employee/block',
      'DELETE',
      payload,
      true,
      {
        pending: 'Blocking Employee...',
        success: 'Employee block successfully',
        error: 'An error occurred while blocking employee',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_EMPLOYEES_DATA });
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
export default function* blockEmployees() {
  yield takeEvery(BLOCK_EMPLOYEES_DATA, blockEmployeeSaga);
}
