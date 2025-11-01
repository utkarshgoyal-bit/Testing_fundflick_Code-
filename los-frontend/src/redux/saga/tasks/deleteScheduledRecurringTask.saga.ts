import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { TasksAction } from '@/lib/interfaces';
import { ITaskTable } from '@/lib/interfaces/tables';
import { DELETE_SCHEDULED_RECURRING_TASK, FETCH_BULK_TASKS } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/tasks';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteScheduledRecurringTaskSaga(action: TasksAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ tasks: ITaskTable[] }> = yield call(apiCaller, '/tasks/scheduled-recurring', 'DELETE', payload, true, {
      pending: 'Deleting Scheduled/Recurring Task...',
      success: 'Scheduled/Recurring Task deleted successfully',
      error: 'An error occurred while deleting scheduled/recurring task',
    });
    if (response.data) {
      yield put({ type: FETCH_BULK_TASKS });
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Delete scheduled/recurring task failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* deleteScheduledRecurringTasks() {
  yield takeEvery(DELETE_SCHEDULED_RECURRING_TASK, deleteScheduledRecurringTaskSaga);
}
