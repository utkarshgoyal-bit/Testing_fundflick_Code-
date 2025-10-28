import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { EmployeesAction } from '@/lib/interfaces/employee.interface';
import { IEmployeeTable } from '@/lib/interfaces/tables';
import { FETCH_EMPLOYEES_DATA, UNBLOCK_EMPLOYEES_DATA } from '@/redux/actions/types';
import { setError } from '@/redux/slices/employees';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* unblockEmployeeSaga(action: EmployeesAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ employees: IEmployeeTable[] }> = yield call(
      apiCaller,
      '/employee/unblock',
      'PATCH',
      payload,
      true,
      {
        pending: 'Unblocking Employee...',
        success: 'Employee unblock successfully',
        error: 'An error occurred while unblocking employee',
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

export default function* unblockEmployee() {
  yield takeEvery(UNBLOCK_EMPLOYEES_DATA, unblockEmployeeSaga);
}
