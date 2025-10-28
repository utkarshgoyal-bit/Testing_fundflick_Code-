import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { EmployeesAction } from '@/lib/interfaces/employee.interface';
import { IEmployeeTable } from '@/lib/interfaces/tables';
import { REGISTER_EMPLOYEES_DATA } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/employees';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* registerNewEmployeeSaga(action: EmployeesAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ employees: IEmployeeTable[] }> = yield call(
      apiCaller,
      '/employee',
      'POST',
      payload,
      true,
      {
        pending: 'Creating New Employees...',
        success: 'Employee created successfully',
        error: 'An error occurred while creating employee',
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

export default function* registerNewEmployees() {
  yield takeEvery(REGISTER_EMPLOYEES_DATA, registerNewEmployeeSaga);
}
