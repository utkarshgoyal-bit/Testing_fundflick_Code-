import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { TasksAction } from '@/lib/interfaces';
import { ITaskTable } from '@/lib/interfaces/tables';
import { CREATE_BULK_TASK, FETCH_BULK_TASKS } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError, setTaskDialogOpen } from '@/redux/slices/tasks';
import { call, put, takeEvery } from 'redux-saga/effects';

function* createBulkTaskSaga(action: TasksAction) {
    yield put(setLoading({ loading: true, message: 'Creating New Bulk Task...' }));
    const { payload } = action;
    try {
        const response: ApiResponse<{ tasks: ITaskTable[] }> = yield call(apiCaller, '/tasks/bulk', 'POST', payload, true, {
            pending: 'Creating New Bulk Tasks...',
            success: 'Bulk tasks created successfully',
            error: 'An error occurred while creating bulk tasks',
        });
        if (response.data) {
            yield put({ type: FETCH_BULK_TASKS });
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

export default function* watchCreateBulkTaskSaga(): Generator<any, void, any> {
    yield takeEvery(CREATE_BULK_TASK, createBulkTaskSaga);
}
