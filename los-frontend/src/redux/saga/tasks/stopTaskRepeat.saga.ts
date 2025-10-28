import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { TasksAction } from '@/lib/interfaces';
import { ITaskTable } from '@/lib/interfaces/tables';
import { FETCH_TASKS_DATA, STOP_REPEAT_TASK } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/tasks';
import { call, put, takeEvery } from 'redux-saga/effects';

function* stopTaskRepeatSaga(action: TasksAction) {
  yield put(setLoading({ loading: true, message: 'Stopping Task Repeat...' }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ tasks: ITaskTable[] }> = yield call(
      apiCaller,
      '/tasks/stopRepeat',
      'PATCH',
      payload,
      true,
      {
        pending: 'Stopping Task Repeat...',
        success: 'Task repeat stopped successfully',
        error: 'An error occurred while stopping task repeat',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_TASKS_DATA });
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

export default function* stopTaskRepeat() {
  yield takeEvery(STOP_REPEAT_TASK, stopTaskRepeatSaga);
}
