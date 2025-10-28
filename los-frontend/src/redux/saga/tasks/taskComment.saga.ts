import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { TasksAction } from '@/lib/interfaces';
import { ITaskTable } from '@/lib/interfaces/tables';
import { ADD_COMMENT, FETCH_TASKS_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/tasks';
import { call, put, takeEvery } from 'redux-saga/effects';

function* taskCommentSaga(action: TasksAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ tasks: ITaskTable[] }> = yield call(
      apiCaller,
      '/tasks/comment',
      'POST',
      payload,
      true,
      {
        pending: 'Commenting Task ...',
        success: 'Task commented successfully',
        error: 'An error occurred while commenting task',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_TASKS_DATA, payload: { silent: false } });
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

export default function* taskComment() {
  yield takeEvery(ADD_COMMENT, taskCommentSaga);
}
