import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ITaskTable } from '@/lib/interfaces/tables';
import { FETCH_TASKS_DASHBOARD_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError } from '@/redux/slices/taskDashboard';
import { call, put, takeEvery } from 'redux-saga/effects';
function* fetchTasksDashboardSaga(action: {
  type: string;
  payload: {
    type: 'team' | 'individual';
  };
}) {
  try {
    yield put(setLoading({ loading: true, message: 'Fetching tasks...' }));
    const response: ApiResponse<{ data: ITaskTable[]; total: number }> = yield call(
      apiCaller,
      `/tasks/dashboard?type=${action.payload.type}`
    );
    const { data: tasks } = response;
    if (tasks?.data) {
      yield put(setData(tasks.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* fetchTasksDashboard() {
  yield takeEvery(FETCH_TASKS_DASHBOARD_DATA, fetchTasksDashboardSaga);
}
