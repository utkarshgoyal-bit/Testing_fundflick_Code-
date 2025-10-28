import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { TasksAction } from '@/lib/interfaces';
import { ITaskTable } from '@/lib/interfaces/tables';
import { ADD_TASK, FETCH_TASKS_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError, setTaskDialogOpen } from '@/redux/slices/tasks';
import { call, put, takeEvery } from 'redux-saga/effects';

function* createTaskSaga(action: TasksAction) {
  yield put(setLoading({ loading: true, message: 'Creating New Task...' }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ tasks: ITaskTable[] }> = yield call(apiCaller, '/tasks', 'POST', payload, true, {
      pending: 'Creating New Tasks...',
      success: 'Task created successfully',
      error: 'An error occurred while creating task',
    });
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
    yield put(setTaskDialogOpen(false));
  }
}

export default function* createTask() {
  yield takeEvery(ADD_TASK, createTaskSaga);
}
