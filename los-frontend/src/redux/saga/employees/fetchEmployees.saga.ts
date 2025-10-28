import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IEmployeeTable } from '@/lib/interfaces/tables';
import { FETCH_EMPLOYEES_DATA } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/employees';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchEmployeesSaga() {
  yield put(setLoading({ loading: true }));
  try {
    const response: ApiResponse<IEmployeeTable[]> = yield call(apiCaller, '/employee');
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

export default function* fetchEmployee() {
  yield takeEvery(FETCH_EMPLOYEES_DATA, fetchEmployeesSaga);
}
