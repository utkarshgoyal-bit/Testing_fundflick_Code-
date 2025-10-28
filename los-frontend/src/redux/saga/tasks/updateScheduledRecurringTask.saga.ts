import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { TasksAction } from '@/lib/interfaces';
import { ITaskTable } from '@/lib/interfaces/tables';
import { UPDATE_SCHEDULED_RECURRING_TASK } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError } from '@/redux/slices/tasks';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateScheduledRecurringTaskSaga(action: TasksAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ tasks: ITaskTable[] }> = yield call(apiCaller, '/tasks/scheduled-recurring', 'PUT', payload, true, {
      pending: 'Updating Scheduled/Recurring Task...',
      success: 'Scheduled/Recurring Task updated successfully',
      error: 'An error occurred while updating scheduled/recurring task',
    });
    if (response.data) {
      yield put(setData(response.data.tasks));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Update scheduled/recurring task failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* updateScheduledRecurringTask() {
  yield takeEvery(UPDATE_SCHEDULED_RECURRING_TASK, updateScheduledRecurringTaskSaga);
}
