import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IDepartmentTable } from '@/lib/interfaces/tables';
import { FETCH_DEPARTMENTS } from '@/redux/actions/types';
import { setData, setError, setTotalDepartments } from '@/redux/slices/department';
import { setLoading } from '@/redux/slices/publicSlice';
import { RootState } from '@/redux/store';
import { call, put, select, takeEvery } from 'redux-saga/effects';
function* fetchDepartmentSaga(action: {
  type: string;
  payload: {
    silent?: boolean;
    filter?: {
      activeFilter?: string;
      statusFilter?: string;
    };
  };
}) {
  if (!action.payload?.silent) {
    yield put(setLoading({ loading: true }));
  }
  try {
    const { activePage } = yield select((state: RootState) => state.department);
    const response: ApiResponse<{ data: IDepartmentTable[]; total: number }> = yield call(
      apiCaller,
      `/department?page=${activePage}`
    );
    if (response.data) {
      yield put(setData(response.data));
      yield put(setTotalDepartments(response.data.total));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    if (!action.payload?.silent) {
      yield put(setLoading({ loading: false }));
    }
  }
}

export default function* fetchDepartments() {
  yield takeEvery(FETCH_DEPARTMENTS, fetchDepartmentSaga);
}
