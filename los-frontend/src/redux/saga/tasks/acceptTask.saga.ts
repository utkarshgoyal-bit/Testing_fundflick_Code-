import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { TasksAction } from '@/lib/interfaces';
import { ITaskTable } from '@/lib/interfaces/tables';
import { ACCEPT_TASK, FETCH_TASKS_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/tasks';
import { call, put, takeEvery } from 'redux-saga/effects';

function* acceptSaga(action: TasksAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ tasks: ITaskTable[] }> = yield call(
      apiCaller,
      `/tasks/accept/${payload.taskId}`,
      'POST',
      {},
      true,
      {
        pending: 'Getting file handlers',
        success: 'File handlers retrieved successfully',
        error: 'An error occurred while getting file handlers',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_TASKS_DATA, payload: { silent: true } });
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

export default function* acceptTask() {
  yield takeEvery(ACCEPT_TASK, acceptSaga);
}
