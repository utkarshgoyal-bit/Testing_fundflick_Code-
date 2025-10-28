import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ITaskTable } from '@/lib/interfaces/tables';
import { FETCH_SCHEDULED_RECURRING_TASKS } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError, setTotalTasks } from '@/redux/slices/tasks';
import { RootState } from '@/redux/store';
import { call, put, select, takeEvery } from 'redux-saga/effects';

function* fetchScheduledRecurringTasksSaga(action: {
  type: string;
  payload: {
    silent?: boolean;
    filter?: {
      activeFilter?: string;
      statusFilter?: string;
    };
  };
}) {
  try {
    yield put(setLoading({ loading: true, message: 'Fetching scheduled/recurring tasks...' }));
    const { activeTab, activeFilter, statusFilter, activePage } = yield select((state: RootState) => state.tasks);
    const response: ApiResponse<{ data: ITaskTable[]; total: number }> = yield call(
      apiCaller,
      `/tasks/scheduled-recurring?active=${activeTab === 'active'}&activeFilter=${action.payload?.filter?.activeFilter || activeFilter}&statusFilter=${action.payload?.filter?.statusFilter || statusFilter}&page=${activePage}`
    );
    const { data: tasks } = response;
    if (tasks?.data) {
      yield put(setData(tasks.data));
      yield put(setTotalTasks(tasks.total));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* fetchScheduledRecurringTasks() {
  yield takeEvery(FETCH_SCHEDULED_RECURRING_TASKS, fetchScheduledRecurringTasksSaga);
}
