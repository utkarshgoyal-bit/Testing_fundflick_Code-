import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { EmployeesAction } from '@/lib/interfaces/employee.interface';
import { IEmployeeTable } from '@/lib/interfaces/tables';
import { EDIT_EMPLOYEES_DATA } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/employees';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editEmployeeSaga(action: EmployeesAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ employees: IEmployeeTable[] }> = yield call(
      apiCaller,
      '/employee',
      'PUT',
      payload,
      true,
      {
        pending: 'Updating Employee...',
        success: 'Employee updated successfully',
        error: 'An error occurred while updating employee',
      }
    );
    if (response.data) {
      yield put(setData(response.data.employees));
      navigation(buildOrgRoute(ROUTES.EMPLOYEE_MANAGEMENT));
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

export default function* editEmployee() {
  yield takeEvery(EDIT_EMPLOYEES_DATA, editEmployeeSaga);
}
