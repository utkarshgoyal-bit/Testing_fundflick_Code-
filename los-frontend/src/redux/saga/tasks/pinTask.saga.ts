import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { TasksAction } from '@/lib/interfaces';
import { ITaskTable } from '@/lib/interfaces/tables';
import { FETCH_TASKS_DATA, PIN_TASK } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/tasks';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { call, put, takeEvery } from 'redux-saga/effects';

function* pinTaskSaga(action: TasksAction) {
  try {
    yield put(setLoading({ loading: true }));
    const { payload } = action;
    const response: ApiResponse<{ tasks: ITaskTable[] }> = yield call(
      apiCaller,
      `/tasks/pin/${payload.taskId}`,
      'PATCH',
      {}
    );
    if (response instanceof AxiosError)
      toast.error(response.response?.data.errorMessage || 'An unexpected error occurred');

    if (response.data) {
      yield put({ type: FETCH_TASKS_DATA, payload: { silent: true } });
    } else if (response.error) {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    if (error instanceof AxiosError) toast.error(error.response?.data.errorMessage || 'An unexpected error occurred');
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* pinTask() {
  yield takeEvery(PIN_TASK, pinTaskSaga);
}
